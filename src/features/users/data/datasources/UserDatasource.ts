import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { UserModel } from '../models/UserModel'
import { IUser } from '../../domain/entities/IUser'
import { IUserFilters } from '../../domain/entities/IUserFilters'
import { PaginationDTO } from '../../../../shared/utils/pagination-dto'

export interface UserDataSource {
  getAll(pagination?: PaginationDTO): Promise<{
    count: number
    users: UserModel[]
  }>

  getByFilters(
    filters: IUserFilters,
    pagination?: PaginationDTO,
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

  getAll = async (pagination?: PaginationDTO) => {
    console.log('pagination', pagination)

    const result = await AxiosClient.get(API_ROUTES.USERS.GET_ALL, {
      params: { ...pagination },
    })

    if ('error' in result) {
      return { count: 0, users: [] as UserModel[] }
    }

    return result.data as { count: number; users: UserModel[] }
  }

  getByFilters = async (filters: IUserFilters, pagination?: PaginationDTO) => {
    const result = await AxiosClient.get(API_ROUTES.USERS.GET_BY_FILTERS, {
      params: { ...filters, ...pagination },
    })

    if ('error' in result) {
      return { count: 0, users: [] as UserModel[] }
    }

    return result.data as { count: number; users: UserModel[] }
  }

  update = async (user: Partial<IUser>) => {
    const { id, ...rest } = user

    if (user.accessModules) {
      rest.accessModules = user.accessModules.map((module) => module.id)
    }

    if (user.accessCareersDegCert) {
      rest.accessCareersDegCert = user.accessCareersDegCert.map(
        (career) => career.id,
      )
    }

    const result = await AxiosClient.patch(
      API_ROUTES.USERS.UPDATE(id as number),
      rest,
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
