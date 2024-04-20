import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { UserModel } from '../models/UserModel'
import { IUser } from '../../domain/entities/IUser'
import { IUserFilters } from '../../domain/entities/IUserFilters'

export interface UserDataSource {
  getAll(
    limit: number,
    offset: number,
  ): Promise<{
    count: number
    users: UserModel[]
  }>

  getByFilters(
    limit: number,
    offset: number,
    filters: IUserFilters,
  ): Promise<{
    count: number
    users: UserModel[]
  }>

  update(user: Partial<IUser>): Promise<{
    user: UserModel
    accessToken: string
  }>

  create(user: IUser): Promise<UserModel>
}

export class UserDataSourceImpl implements UserDataSource {
  static instance: UserDataSourceImpl

  static getInstance = (): UserDataSourceImpl => {
    if (!UserDataSourceImpl.instance) {
      UserDataSourceImpl.instance = new UserDataSourceImpl()
    }

    return UserDataSourceImpl.instance
  }

  getAll = async () => {
    const result = await AxiosClient.get(API_ROUTES.USERS.GET_ALL)

    if ('error' in result) {
      return { count: 0, users: [] as UserModel[] }
    }

    return result.data as { count: number; users: UserModel[] }
  }

  getByFilters = async (
    limit: number,
    offset: number,
    filters: IUserFilters,
  ) => {
    const result = await AxiosClient.get(API_ROUTES.USERS.GET_BY_FILTERS, {
      params: { limit, offset, ...filters },
    })

    if ('error' in result) {
      return { count: 0, users: [] as UserModel[] }
    }

    return result.data as { count: number; users: UserModel[] }
  }

  update = async (user: Partial<IUser>) => {
    const { id, ...body } = user

    const result = await AxiosClient.patch(
      API_ROUTES.USERS.UPDATE(id as number),
      body,
    )

    if ('error' in result) {
      return { user: {} as UserModel, accessToken: '' }
    }

    return result.data as { user: UserModel; accessToken: string }
  }

  create = async (user: UserModel) => {
    const result = await AxiosClient.post(API_ROUTES.USERS.CREATE, user)

    if ('error' in result) {
      return {} as UserModel
    }

    return result.data as UserModel
  }
}
