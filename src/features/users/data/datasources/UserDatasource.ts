import { UserModel } from '../models/UserModel'
import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { IUser } from '../../domain/entities/IUser'

export interface UsersDataSource {
  getAll(): Promise<{
    status: number
    users: UserModel[]
  }>

  update(user: Partial<IUser>): Promise<{
    status: number
    user: UserModel
  }>

  create(user: IUser): Promise<{
    status: number
    user: UserModel
  }>

  delete(id: number): Promise<{
    status: number
    message?: string
  }>

  getUserById(id: number): Promise<{
    status: number
    user: UserModel
  }>

  //   bulkUpdate(users: Partial<IUser>[]): Promise<{
  //     status: number
  //     users: UserModel[]
  //   }>
}

export class UsersDataSourceImpl implements UsersDataSource {
  static instance: UsersDataSourceImpl
  static getInstance = (): UsersDataSourceImpl => {
    if (!UsersDataSourceImpl.instance) {
      UsersDataSourceImpl.instance = new UsersDataSourceImpl()
    }
    return UsersDataSourceImpl.instance
  }
  getAll = async () => {
    const result = await AxiosClient.get(API_ROUTES.USERS.GET_ALL)
    const { status, data } = result
    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, users: [] as UserModel[] }
    }
    return { status, users: data.content as UserModel[] }
  }

  update = async (user: IUser) => {
    const { id, ...rest } = user
    const result = await AxiosClient.patch(
      API_ROUTES.USERS.UPDATE.replace(':id', id?.toString() || ''),
      rest,
    )
    const { status, data } = result
    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, user: {} as UserModel }
    }
    return { status, user: data.content as UserModel }
  }

  create = async (user: IUser) => {
    const result = await AxiosClient.post(API_ROUTES.USERS.CREATE, user)
    const { status, data } = result
    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, user: {} as UserModel }
    }
    return { status, user: data.content as UserModel }
  }

  delete = async (id: number) => {
    const result = await AxiosClient.delete(API_ROUTES.USERS.DELETE, { id })
    const { status, data } = result
    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, message: data.message }
    }
    return { status }
  }

  getUserById = async (id: number) => {
    const result = await AxiosClient.get(
      API_ROUTES.USERS.GET_ONE.replace(':id', id.toString()),
    )
    const { status, data } = result
    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, user: {} as UserModel }
    }
    return { status, user: data.content as UserModel }
  }

  //   bulkUpdate(users: IUser[]) {
  //     const result = AxiosClient.patch(API_ROUTES.USERS.UPDATE, users)
  //     return result.then(({ status, data }) => {
  //       if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
  //         return { status, users: [] as UserModel[] }
  //       }
  //       return { status, users: data.content as UserModel[] }
  //     })
  //   }
}
