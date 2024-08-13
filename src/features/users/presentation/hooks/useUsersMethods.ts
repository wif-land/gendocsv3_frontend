import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { UserUseCasesImpl } from '../../domain/usecases/UserService'
import { IUser } from '../../domain/entities/IUser'
import { useUsersStore } from '../state/usersStore'
import { IUserFilters } from '../../domain/entities/IUserFilters'
import { PaginationDTO } from '../../../../shared/utils/pagination-dto'

export const useUsersMethods = () => {
  const { users, setUsers } = useUsersStore()
  const { loader } = useLoaderStore()

  const fetchData = async (rowsPerPage: number, currentPage: number) =>
    await UserUseCasesImpl.getInstance().getAll(
      new PaginationDTO(
        (currentPage * rowsPerPage) / rowsPerPage + 1,
        rowsPerPage,
      ),
    )

  const updateRow = async (user: Partial<IUser>) =>
    await UserUseCasesImpl.getInstance().update({
      id: user.id,
      isActive: !user.isActive,
    })

  const fetchDataByFilters = async (
    rowsPerPage: number,
    currentPage: number,
    filters: IUserFilters,
  ) =>
    await UserUseCasesImpl.getInstance().getByFiters(
      filters,
      new PaginationDTO(
        (currentPage * rowsPerPage) / rowsPerPage + 1,
        rowsPerPage,
      ),
    )

  return {
    loader,
    users,
    setUsers,
    fetchData,
    updateRow,
    fetchDataByField: fetchDataByFilters,
  }
}
