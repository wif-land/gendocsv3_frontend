import { useEffect, useState } from 'react'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { useStudentStore } from '../state/studentStore'
import { StudentModel } from '../../data/models/StudentModel'
import { TableProps } from '../../../../shared/sdk/table'
import { useStudentCommands } from './useStudentCommands'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { IStudentFilters } from '../../domain/entities/IStudentFilters'

interface Props {
  table: TableProps
  setCount: (count: number) => void
  isDataFiltered: boolean
  visitedPages: number[]
  setVisitedPages: (value: number[]) => void
  filters: IStudentFilters
}

export const useStudentView = ({
  table,
  setCount,
  isDataFiltered,
  visitedPages,
  setVisitedPages,
  filters,
}: Props) => {
  const [tableData, setTableData] = useState<StudentModel[]>([])
  const { students, setStudents } = useStudentStore()
  const { loader } = useLoaderStore()
  const { fetchData, updateRow, updateRows, fetchDataByField } =
    useStudentCommands()

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
              setStudents([...(students || []), ...response.data.students])
              setTableData([
                ...(students as StudentModel[]),
                ...response.data.students,
              ])
            }
          },
        )
      } else {
        fetchData(table.rowsPerPage, newPage).then((data) => {
          if (data?.students) {
            setStudents([...(students || []), ...data.students])
            setTableData([...(students as StudentModel[]), ...data.students])
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
      fetchDataByField(filters, parseInt(event.target.value, 10), 0).then(
        (response) => {
          if (response?.status === HTTP_STATUS_CODES.OK) {
            setStudents(response.data.students)
            setTableData(response.data.students)
            setCount(response.data.count)
          }

          if (response?.status === HTTP_STATUS_CODES.NOT_FOUND) {
            setStudents([])
            setTableData([])
            setCount(0)
          }
        },
      )
    } else {
      fetchData(parseInt(event.target.value, 10), table.page).then((data) => {
        if (data?.students) {
          setStudents(data.students)
          setTableData(data.students)
        }
        if (data?.count) {
          setCount(data.count)
        }
      })
    }
  }

  const handleUpdateRow = (row: StudentModel) => {
    updateRow(row).then((data) => {
      if (data) {
        setStudents(
          students?.map((functionary) =>
            functionary.id === data.id ? data : functionary,
          ),
        )
        setTableData(
          (students as StudentModel[]).map((functionary) =>
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

    const rowsData = rows.map((row: StudentModel) => ({
      isActive: !row.isActive,
      id: row.id!,
    }))

    updateRows(rowsData).then((data) => {
      if (data !== undefined) {
        setStudents(
          students?.map((functionary) => {
            const updatedFunctionary = data.find(
              (updated) => updated.id === functionary.id,
            )
            return updatedFunctionary ? updatedFunctionary : functionary
          }),
        )
      }
      setTableData(
        (students as StudentModel[]).map((functionary) => {
          const updatedFunctionary = data?.find(
            (updated) => updated.id === functionary.id,
          )
          return updatedFunctionary ? updatedFunctionary : functionary
        }),
      )
      table.setSelected([])
    })
  }

  const handleSearch = (filters: IStudentFilters) => {
    fetchDataByField(filters, table.rowsPerPage, table.page).then(
      (response) => {
        if (response?.status === HTTP_STATUS_CODES.OK) {
          setStudents(response.data.students)
          setTableData(response.data.students)
          setCount(response.data.count)
          return
        }

        if (response?.status === HTTP_STATUS_CODES.NOT_FOUND) {
          setStudents([])
          setTableData([])
          setCount(0)
          return
        }
      },
    )
  }

  useEffect(() => {
    let isMounted = true
    if (tableData.length === 0) {
      if (isMounted && !isDataFiltered) {
        fetchData(table.rowsPerPage, table.page).then((data) => {
          if (data?.students) {
            setStudents(data.students)
            setTableData(data.students)
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

  return {
    loader,
    students,
    tableData,
    setTableData,
    setStudents,
    handleChangePage,
    handleChangeRowsPerPage,
    handleUpdateRow,
    handleUpdateRows,
    handleSearch,
  }
}
