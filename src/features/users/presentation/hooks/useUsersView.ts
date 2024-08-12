import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { useEffect } from 'react'
import { TableProps } from '../../../../shared/sdk/table'
import { useUsersMethods } from './useUsersMethods'
import { IUser } from '../../domain/entities/IUser'
import { useUsersStore } from '../state/usersStore'
import { UserModel } from '../../data/models/UserModel'
import { IUserFilters } from '../../domain/entities/IUserFilters'

interface Props {
  tableData: IUser[]
  setTableData: (data: IUser[]) => void
  table: TableProps
  setCount: (count: number) => void
  isDataFiltered: boolean
  visitedPages: number[]
  setVisitedPages: (value: number[]) => void
  filters: IUserFilters
}

export const useUserView = ({
  tableData,
  setTableData,
  table,
  setCount,
  isDataFiltered,
  visitedPages,
  setVisitedPages,
  filters,
}: Props) => {
  const { users, setUsers } = useUsersStore()
  const { loader } = useLoaderStore()
  const { fetchData, updateRow, fetchDataByField } = useUsersMethods()

  useEffect(() => {
    let isMounted = true
    if (tableData.length === 0 && table.rowsPerPage === 5) {
      if (isMounted && !isDataFiltered) {
        fetchData(table.rowsPerPage, table.page).then((data) => {
          if (data?.users) {
            setTableData(data.users)
            setUsers(data.users)
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
        fetchDataByField(table.rowsPerPage, newPage, filters).then(
          (response) => {
            setUsers([...users, ...response.users])
            setTableData([...(users as IUser[]), ...response.users])
          },
        )
      } else {
        fetchData(table.rowsPerPage, newPage).then((data) => {
          if (data?.users) {
            setUsers([...users, ...data.users])
            setTableData([...(users as UserModel[]), ...data.users])
          }
        })
      }
    }
  }

  const handleChangeRowsPerPage = () => {
    table.setPage(0)
    setTableData([])
    setVisitedPages([])

    if (isDataFiltered) {
      fetchDataByField(table.rowsPerPage, table.page, filters).then(
        (response) => {
          if (response?.users.length > 0) {
            setUsers(response.users)
            setTableData(response.users)
            setCount(response.count)
          } else {
            setUsers([])
            setTableData([])
            setCount(0)
          }
        },
      )
    } else {
      fetchData(table.rowsPerPage, table.page).then((data) => {
        if (data?.users) {
          setUsers(data.users)
          setTableData(data.users)
        }
        if (data?.count) {
          setCount(data.count)
        }
      })
    }
  }

  const handleUpdateRow = (row: IUser) => {
    updateRow(row).then((data) => {
      if (data) {
        setUsers(
          users?.map((user) => (user.id === data.user.id ? data.user : user)),
        )
        setTableData(
          (users as IUser[]).map((user) =>
            user.id === data.user.id ? data.user : user,
          ),
        )
      }
    })
  }

  const handleSearch = (filters: IUserFilters) => {
    fetchDataByField(table.rowsPerPage, table.page, filters).then(
      (response) => {
        if (response?.users.length > 0) {
          setUsers(response.users)
          setTableData(response.users)
          setCount(response.count)
          return
        }

        setUsers([])
        setTableData([])
        setCount(0)
      },
    )
  }

  useEffect(() => {
    handleChangeRowsPerPage()
  }, [table.rowsPerPage])

  return {
    loader,
    users,
    handleChangePage,
    handleChangeRowsPerPage,
    handleUpdateRow,
    handleSearch,
  }
}
