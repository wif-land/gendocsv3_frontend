import { PaginationDTO } from '../../../../shared/utils/pagination-dto'
import { UserModel } from '../../data/models/UserModel'
import { IUser } from '../entities/IUser'
import { IUserFilters } from '../entities/IUserFilters'

export interface UserRepository {
  getAll: (pagination?: PaginationDTO) => Promise<{
    count: number
    users: UserModel[]
  }>

  getByFilters: (
    filters: IUserFilters,
    pagination?: PaginationDTO,
  ) => Promise<{
    count: number
    users: UserModel[]
  }>

  update: (data: Partial<IUser>) => Promise<{
    user: UserModel
    accessToken: string
  }>

  create: (data: IUser) => Promise<UserModel>
}
