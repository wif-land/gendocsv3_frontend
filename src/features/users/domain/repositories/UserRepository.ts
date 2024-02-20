import { UserModel } from '../../data/models/UserModel'
import { IUser } from '../entities/IUser'

export interface UserRepository {
  getAll: (
    limit: number,
    offset: number,
  ) => Promise<{
    status: number
    data: {
      count: number
      users: UserModel[]
    }
  }>

  getByField: (
    field: string,
    limit: number,
    offset: number,
  ) => Promise<{
    status: number
    data: {
      count: number
      users: UserModel[]
    }
  }>

  update: (data: Partial<IUser>) => Promise<{
    status: number
    user: UserModel
  }>

  create: (data: IUser) => Promise<{
    status: number
    user: UserModel
  }>
}
