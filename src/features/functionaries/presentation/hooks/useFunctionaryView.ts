import { useFunctionaryStore } from '../state/useFunctionaryStore'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { FunctionaryUseCasesImpl } from '../../domain/usecases/FunctionaryServices'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { FunctionaryModel } from '../../data/models/FunctionatyModel'
import { useEffect } from 'react'
import { TableProps } from '../../../../shared/sdk/table'

interface Props {
  tableData: FunctionaryModel[]
  setTableData: (data: FunctionaryModel[]) => void
  table: TableProps
  setCount: (count: number) => void
  isDataFiltered: boolean
  visitedPages: number[]
}

export const useFunctionaryView = ({
  tableData,
  setTableData,
  table,
  setCount,
  isDataFiltered,
  visitedPages,
}: Props) => {
  const { functionaries, setFunctionaries } = useFunctionaryStore()
  const { loader, addLoaderItem, removeLoaderItem } = useLoaderStore()

  useEffect(() => {
    let isMounted = true
    if (tableData.length === 0) {
      if (isMounted) {
        fetchData(table.rowsPerPage, table.page).then((data) => {
          if (data?.functionaries) {
            setFunctionaries(data.functionaries)
            setTableData(data.functionaries)
          }
          if (data?.count) {
            setCount(data.count)
          }
        })
      }
    }
    return () => {
      isMounted = false
    }
  }, [tableData, isDataFiltered])

  const fetchData = async (rowsPerPage: number, currentPage: number) => {
    addLoaderItem('functionaries')
    try {
      const response = await FunctionaryUseCasesImpl.getInstance().getAll(
        rowsPerPage,
        currentPage * rowsPerPage,
      )
      if (response.status === HTTP_STATUS_CODES.OK) {
        return response.data as {
          functionaries: FunctionaryModel[]
          count: number
        }
      }
    } catch (error) {
      return {
        functionaries: [],
        count: 0,
      }
    } finally {
      removeLoaderItem('functionaries')
    }
  }

  const updateRow = async (functionary: Partial<FunctionaryModel>) => {
    addLoaderItem('functionaries')
    try {
      const response = await FunctionaryUseCasesImpl.getInstance().update(
        functionary.id as number,
        {
          isActive: !functionary.isActive,
        },
      )
      if (response.status === HTTP_STATUS_CODES.OK) {
        return response.functionary as FunctionaryModel
      }
    } catch (error) {
      return null
    } finally {
      removeLoaderItem('functionaries')
    }
  }

  const updateRows = async (functionaries: Partial<FunctionaryModel>[]) => {
    addLoaderItem('functionaries')
    try {
      const response =
        await FunctionaryUseCasesImpl.getInstance().bulkUpdate(functionaries)
      if (response.status === HTTP_STATUS_CODES.OK) {
        return response.functionaries as FunctionaryModel[]
      }
    } catch (error) {
      return []
    } finally {
      removeLoaderItem('functionaries')
    }
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    table.onChangePage(event, newPage)
    table.setPage(newPage)

    if (visitedPages.includes(newPage)) {
      return
    } else {
      visitedPages.push(newPage)
    }

    if (newPage > table.page) {
      if (isDataFiltered) {
        console.log('fetchData filtered unimplemented')
      } else {
        fetchData(table.rowsPerPage, newPage).then((data) => {
          if (data?.functionaries) {
            setFunctionaries([...functionaries, ...data.functionaries])
            setTableData([
              ...(functionaries as FunctionaryModel[]),
              ...data.functionaries,
            ])
          }
        })
      }
    }
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    table.onChangeRowsPerPage(event)
    table.setPage(0)
    setTableData([])

    if (isDataFiltered) {
      console.log('fetchData filtered unimplemented')
    } else {
      fetchData(parseInt(event.target.value, 10), table.page).then((data) => {
        if (data?.functionaries) {
          setFunctionaries(data.functionaries)
          setTableData(data.functionaries)
        }
        if (data?.count) {
          setCount(data.count)
        }
      })
    }
  }

  const handleUpdateRow = (row: FunctionaryModel) => {
    updateRow(row).then((data) => {
      if (data) {
        setFunctionaries(
          functionaries.map((functionary) =>
            functionary.id === data.id ? data : functionary,
          ),
        )
        setTableData(
          (functionaries as FunctionaryModel[]).map((functionary) =>
            functionary.id === data.id ? data : functionary,
          ),
        )
      }
    })
  }

  const handleUpdateRows = () => {
    const rows = tableData.filter((row) =>
      table.selected.includes(row.id!.toString()),
    )

    const rowsData = rows.map((row: FunctionaryModel) => ({
      isActive: !row.isActive,
      id: row.id!,
    }))

    updateRows(rowsData).then((data) => {
      if (data !== undefined) {
        setFunctionaries(
          functionaries.map((functionary) => {
            const updatedFunctionary = data.find(
              (updated) => updated.id === functionary.id,
            )
            return updatedFunctionary ? updatedFunctionary : functionary
          }),
        )
      }
      setTableData(
        (functionaries as FunctionaryModel[]).map((functionary) => {
          const updatedFunctionary = data?.find(
            (updated) => updated.id === functionary.id,
          )
          return updatedFunctionary ? updatedFunctionary : functionary
        }),
      )
      table.setSelected([])
    })
  }

  return {
    loader,
    functionaries,
    setFunctionaries,
    handleChangePage,
    handleChangeRowsPerPage,
    handleUpdateRow,
    handleUpdateRows,
  }
}
