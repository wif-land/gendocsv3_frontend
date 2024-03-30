import { useFunctionaryStore } from '../state/useFunctionaryStore'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { FunctionaryModel } from '../../data/models/FunctionatyModel'
import { useEffect } from 'react'
import { TableProps } from '../../../../shared/sdk/table'
import { useFunctionaryMethods } from './useFunctionaryMethods'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { IFunctionaryFilters } from '../../domain/entities/IFunctionaryFilters'

interface Props {
  tableData: FunctionaryModel[]
  setTableData: (data: FunctionaryModel[]) => void
  table: TableProps
  setCount: (count: number) => void
  isDataFiltered: boolean
  visitedPages: number[]
  setVisitedPages: (value: number[]) => void
  filters: IFunctionaryFilters
}

export const useFunctionaryView = ({
  tableData,
  setTableData,
  table,
  setCount,
  isDataFiltered,
  visitedPages,
  setVisitedPages,
  filters,
}: Props) => {
  const { functionaries, setFunctionaries } = useFunctionaryStore()
  const { loader } = useLoaderStore()
  const { fetchData, updateRow, updateRows, fetchDataByField } =
    useFunctionaryMethods()

  useEffect(() => {
    let isMounted = true
    if (tableData.length === 0) {
      if (isMounted && !isDataFiltered) {
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
        fetchDataByField(filters, table.rowsPerPage, newPage).then(
          (response) => {
            if (response?.status === HTTP_STATUS_CODES.OK) {
              setFunctionaries([
                ...functionaries,
                ...response.data.functionaries,
              ])
              setTableData([
                ...(functionaries as FunctionaryModel[]),
                ...response.data.functionaries,
              ])
            }
          },
        )
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
    setVisitedPages([])

    if (isDataFiltered) {
      fetchDataByField(filters, table.rowsPerPage, table.page).then(
        (response) => {
          if (response?.status === HTTP_STATUS_CODES.OK) {
            setFunctionaries(response.data.functionaries)
            setTableData(response.data.functionaries)
            setCount(response.data.count)
          }

          if (response?.status === HTTP_STATUS_CODES.NOT_FOUND) {
            setFunctionaries([])
            setTableData([])
            setCount(0)
          }
        },
      )
    } else {
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

  const handleSearch = (filters: IFunctionaryFilters) => {
    fetchDataByField(filters, table.rowsPerPage, table.page).then(
      (response) => {
        if (response?.status === HTTP_STATUS_CODES.OK) {
          setFunctionaries(response.data.functionaries)
          setTableData(response.data.functionaries)
          setCount(response.data.count)
          return
        }

        if (response?.status === HTTP_STATUS_CODES.NOT_FOUND) {
          setFunctionaries([])
          setTableData([])
          setCount(0)
          return
        }
      },
    )
  }

  return {
    loader,
    functionaries,
    setFunctionaries,
    handleChangePage,
    handleChangeRowsPerPage,
    handleUpdateRow,
    handleUpdateRows,
    handleSearch,
  }
}
