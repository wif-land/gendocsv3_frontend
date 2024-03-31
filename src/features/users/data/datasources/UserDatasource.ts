import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { UserModel } from '../models/UserModel'
import { IUser } from '../../domain/entities/IUser'

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

  getByField(
    field: string,
    limit: number,
    offset: number,
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

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        data: { count: 0, users: [] as UserModel[] },
      }
    }

    const { status, data } = result

    return {
      status,
      data: data.content as {
        count: number
        users: UserModel[]
      },
    }
  }

  getByField = async (field: string, limit: number, offset: number) => {
    const result = await AxiosClient.get(API_ROUTES.USERS.GET_BY_FIELD(field), {
      params: { limit, offset },
    })

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        data: { count: 0, users: [] as UserModel[] },
      }
    }

    const { status, data } = result

    return {
      status,
      data: data.content as {
        count: number
        users: UserModel[]
      },
    }
  }

  update = async (user: Partial<IUser>) => {
    const { id, ...body } = user

    const result = await AxiosClient.patch(
      API_ROUTES.USERS.UPDATE(id as number),
      body,
    )

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        data: { user: {} as UserModel, accessToken: '' },
      }
    }

    const { status, data } = result

    return {
      status,
      data: data.content as { user: UserModel; accessToken: string },
    }
  }

  create = async (user: UserModel) => {
    const result = await AxiosClient.post(API_ROUTES.USERS.CREATE, user)

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        user: {} as UserModel,
      }
    }

    const { status, data } = result

    return { status, user: data.content as UserModel }
  }
}
