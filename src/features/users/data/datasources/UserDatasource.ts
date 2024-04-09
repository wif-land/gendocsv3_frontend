import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { UserModel } from '../models/UserModel'
import { IUser } from '../../domain/entities/IUser'
import { IUserFilters } from '../../domain/entities/IUserFilters'

export interface UserDataSource {
  getAll(
    limit: number,
    offset: number,
  ): Promise<{
    status: number
    data: {
      count: number
      users: UserModel[]
    }
  }>

  getByFilters(
    limit: number,
    offset: number,
    filters: IUserFilters,
  ): Promise<{
    status: number
    data: {
      count: number
      users: UserModel[]
    }
  }>

  update(user: Partial<IUser>): Promise<{
    status: number
    data: {
      user: UserModel
      accessToken: string
    }
  }>

  create(user: IUser): Promise<{
    status: number
    user: UserModel
  }>
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

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.OK) {
      return {
        status,
        data: data.content as {
          count: number
          users: UserModel[]
        },
      }
    }

    return {
      status,
      data: { count: 0, users: [] as UserModel[] },
    }
  }

  getByFilters = async (
    limit: number,
    offset: number,
    filters: IUserFilters,
  ) => {
    const result = await AxiosClient.get(API_ROUTES.USERS.GET_BY_FILTERS, {
      params: { limit, offset, ...filters },
    })

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.OK) {
      return {
        status,
        data: data.content as {
          count: number
          users: UserModel[]
        },
      }
    }

    return {
      status,
      data: { count: 0, users: [] as UserModel[] },
    }
  }

  update = async (user: Partial<IUser>) => {
    const { id, ...body } = user

    const result = await AxiosClient.patch(
      API_ROUTES.USERS.UPDATE(id as number),
      body,
    )

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.OK) {
      return {
        status,
        data: data.content as { user: UserModel; accessToken: string },
      }
    }

    return {
      status,
      data: data.content as { user: UserModel; accessToken: string },
    }
  }

  create = async (user: UserModel) => {
    const result = await AxiosClient.post(API_ROUTES.USERS.CREATE, user)

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, user: {} as UserModel }
    }

    return { status, user: data.content as UserModel }
  }
}
