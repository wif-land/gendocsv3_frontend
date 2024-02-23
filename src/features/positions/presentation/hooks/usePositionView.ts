import { usePositionStore } from '../state/usePositionStore'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { PositionModel } from '../../data/models/PositionModel'
import { useEffect } from 'react'
import { TableProps } from '../../../../shared/sdk/table'
import { useFunctionaryMethods } from './usePositionMethods'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'

interface Props {
  tableData: PositionModel[]
  setTableData: (data: PositionModel[]) => void
  table: TableProps
  setCount: (count: number) => void
  isDataFiltered: boolean
  visitedPages: number[]
  setVisitedPages: (value: number[]) => void
  field: string
}

export const useFunctionaryView = ({
  tableData,
  setTableData,
  table,
  setCount,
  isDataFiltered,
  visitedPages,
  setVisitedPages,
  field,
}: Props) => {
  const { positions, setPositions } = usePositionStore()
  const { loader } = useLoaderStore()
  const { fetchData, fetchDataByField, deleteRow, deleteManyRows } =
    useFunctionaryMethods()

  useEffect(() => {
    let isMounted = true
    if (tableData.length === 0) {
      if (isMounted && !isDataFiltered) {
        fetchData(table.rowsPerPage, table.page).then((data) => {
          if (data?.positions) {
            setPositions(data.positions)
            setTableData(data.positions)
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
        fetchDataByField(field, table.rowsPerPage, newPage).then((response) => {
          if (response?.status === HTTP_STATUS_CODES.OK) {
            setPositions([...positions, ...response.data.positions])
            setTableData([
              ...(positions as PositionModel[]),
              ...response.data.positions,
            ])
          }
        })
      } else {
        fetchData(table.rowsPerPage, newPage).then((data) => {
          if (data?.positions) {
            setPositions([...positions, ...data.positions])
            setTableData([...(positions as PositionModel[]), ...data.positions])
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
      fetchDataByField(field, parseInt(event.target.value, 10), 0).then(
        (response) => {
          if (response?.status === HTTP_STATUS_CODES.OK) {
            setPositions(response.data.positions)
            setTableData(response.data.positions)
            setCount(response.data.count)
          }

          if (response?.status === HTTP_STATUS_CODES.NOT_FOUND) {
            setPositions([])
            setTableData([])
            setCount(0)
          }
        },
      )
    } else {
      fetchData(parseInt(event.target.value, 10), table.page).then((data) => {
        if (data?.positions) {
          setPositions(data.positions)
          setTableData(data.positions)
        }
        if (data?.count) {
          setCount(data.count)
        }
      })
    }
  }

  const handleDeleteRow = (row: PositionModel) => {
    deleteRow(row.id as number).then((data) => {
      if (data) {
        setPositions(positions.filter((position) => position.id !== row.id))
        setTableData(tableData.filter((position) => position.id !== row.id))
      }
    })
  }

  const handleDeleteManyRows = () => {
    const rows = tableData.filter((row) =>
      table.selected.includes(row.id!.toString()),
    )

    const rowsData = rows.map((row: PositionModel) => row.id as number)

    console.log(rowsData)

    console.log('estoy enfermito')

    // deleteManyRows(rowsData).then((data) => {
    //   if (data !== undefined) {
    //     setPositions(
    //       positions.filter(
    //         (position) => !rowsData.includes(position.id as number),
    //       ),
    //     )
    //     setTableData(
    //       tableData.filter(
    //         (position) => !rowsData.includes(position.id as number),
    //       ),
    //     )
    //   }

    //   table.setSelected([])
    // })
  }

  const handleSearch = (field: string) => {
    fetchDataByField(field, table.rowsPerPage, table.page).then((response) => {
      if (response?.status === HTTP_STATUS_CODES.OK) {
        setPositions(response.data.positions)
        setTableData(response.data.positions)
        setCount(response.data.count)
        return
      }

      if (response?.status === HTTP_STATUS_CODES.NOT_FOUND) {
        setPositions([])
        setTableData([])
        setCount(0)
        return
      }
    })
  }

  return {
    loader,
    positions,
    setPositions,
    handleChangePage,
    handleChangeRowsPerPage,
    handleDeleteRow,
    handleDeleteManyRows,
    handleSearch,
  }
}
