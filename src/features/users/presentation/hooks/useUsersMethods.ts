import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { UserUseCasesImpl } from '../../domain/usecases/UserService'
import { IUser } from '../../domain/entities/IUser'
import { useUsersStore } from '../state/usersStore'
import { IUserFilters } from '../../domain/entities/IUserFilters'

export const useUsersMethods = () => {
  const { users, setUsers } = useUsersStore()
  const { loader } = useLoaderStore()

  const fetchData = async (rowsPerPage: number, currentPage: number) => {
    return await UserUseCasesImpl.getInstance().getAll(
      rowsPerPage,
      currentPage * rowsPerPage,
    )
  }

  const updateRow = async (user: Partial<IUser>) => {
    return await UserUseCasesImpl.getInstance().update(
      user.id as number,
      {
        isActive: !user.isActive,
      },
    )
  }

  const fetchDataByFilters = async (
    rowsPerPage: number,
    currentPage: number,
    filters: IUserFilters,
  ) => {
    return await UserUseCasesImpl.getInstance().getByFiters(
      rowsPerPage,
      currentPage * rowsPerPage,
      filters,
    )
  }

  return {
    loader,
    users,
    setUsers,
    fetchData,
    updateRow,
    fetchDataByField: fetchDataByFilters,
  }
}
