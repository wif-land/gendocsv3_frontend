import { usePositionStore } from '../state/usePositionStore'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { PositionModel } from '../../data/models/PositionModel'
import { useEffect } from 'react'
import { TableProps } from '../../../../shared/sdk/table'
import { useFunctionaryMethods } from './usePositionMethods'

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
          setPositions([...positions, ...response?.positions])
          setTableData([
            ...(positions as PositionModel[]),
            ...response?.positions,
          ])
        })
      } else {
        fetchData(table.rowsPerPage, newPage).then((data) => {
          console.log(data)
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
          if (response?.positions.length > 0) {
            setPositions(response.positions)
            setTableData(response.positions)
            setCount(response.count)
          } else {
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

    const filterData = positions.filter(
      (position) => !rowsData.includes(position.id as number),
    )

    deleteManyRows(rowsData).then((data) => {
      if (data) {
        setPositions(filterData)
        setTableData(filterData as PositionModel[])
      }

      table.setSelected([])
    })
  }

  const handleSearch = (field: string) => {
    fetchDataByField(field, table.rowsPerPage, table.page).then((response) => {
      if (response?.positions.length > 0) {
        setPositions(response.positions)
        setTableData(response.positions)
        setCount(response.count)
        return
      }

      setPositions([])
      setTableData([])
      setCount(0)
      return
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
