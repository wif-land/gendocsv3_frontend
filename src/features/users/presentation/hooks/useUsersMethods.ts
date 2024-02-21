import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { UserUseCasesImpl } from '../../domain/usecases/UserService'
import { IUser } from '../../domain/entities/IUser'
import { useUsersStore } from '../state/usersStore'

export const useUsersMethods = () => {
  const { users, setUsers } = useUsersStore()
  const { loader, addLoaderItem, removeLoaderItem } = useLoaderStore()

  const fetchData = async () => {
    addLoaderItem('users')
    try {
      const response = await UserUseCasesImpl.getInstance().getAll()
      if (response.status === HTTP_STATUS_CODES.OK) {
        return response.data
      }
    } catch (error) {
      return {
        users: [],
        count: 0,
      }
    } finally {
      removeLoaderItem('users')
    }
  }

  const updateRow = async (user: Partial<IUser>) => {
    addLoaderItem('users')
    try {
      const response = await UserUseCasesImpl.getInstance().update(
        user.id as number,
        {
          isActive: !user.isActive,
        },
      )
      if (response.status === HTTP_STATUS_CODES.OK) {
        return response.data.user as IUser
      }
    } catch (error) {
      return null
    } finally {
      removeLoaderItem('users')
    }
  }

  const fetchDataByField = async (
    searchTerm: string,
    rowsPerPage: number,
    currentPage: number,
  ) => {
    addLoaderItem('users')
    try {
      const response = await UserUseCasesImpl.getInstance().getByField(
        searchTerm,
        rowsPerPage,
        currentPage * rowsPerPage,
      )
      if (
        response.status === HTTP_STATUS_CODES.OK ||
        response.status === HTTP_STATUS_CODES.NOT_FOUND
      ) {
        return response as {
          status: number
          data: { count: number; users: IUser[] }
        }
      }
    } catch (error) {
      return {
        status: 500,
        data: {
          count: 0,
          users: [],
        },
      }
    } finally {
      removeLoaderItem('users')
    }
  }

  return {
    loader,
    users,
    setUsers,
    fetchData,
    updateRow,
    fetchDataByField,
  }
}
