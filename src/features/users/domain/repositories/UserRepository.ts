import { UserModel } from '../../data/models/UserModel'
import { IUser } from '../entities/IUser'
import { IUserFilters } from '../entities/IUserFilters'

export interface UserRepository {
  getAll: (
    limit: number,
    offset: number,
  ) => Promise<{
    count: number
    users: UserModel[]
  }>

  getByFilters: (
    limit: number,
    offset: number,
    filters: IUserFilters,
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
