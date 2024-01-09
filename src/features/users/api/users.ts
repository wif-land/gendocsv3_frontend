import 'dotenv/config'
import { AxiosClient } from '../../../shared/utils/AxiosClient'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'
import { ICreateUser, IUser } from '../../auth/types/IUser'
import { API_ROUTES } from '../../../shared/constants/appApiRoutes'
import { IUpdateUser } from '../types/IUserUpdate'

export class UsersApi {
  static get = async (): Promise<{
    status: number
    users?: IUser[]
    message?: string
  }> => {
    const result = await AxiosClient.get(API_ROUTES.USERS.GET_ALL)

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, message: data.message }
    }

    return { status, users: data.content as IUser[] }
  }

  static updateUser = async (
    id: number,
    body: Partial<IUpdateUser>,
  ): Promise<{ status: number; user?: IUser; message?: string }> => {
    const result = await AxiosClient.put(API_ROUTES.USERS.UPDATE, body, {
      id,
    })

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, message: data.message }
    }

    return { status, user: data.content as IUser }
  }

  static createUser = async (
    body: Partial<ICreateUser>,
  ): Promise<{
    status: number
    user?: IUser
    message?: string
  }> => {
    const result = await AxiosClient.post(API_ROUTES.USERS.CREATE, body)

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, message: data.message }
    }

    return { status, user: data.content as IUser }
  }

  static deleteUser = async (
    id: number,
  ): Promise<{ status: number; deleted?: boolean; message?: string }> => {
    const result = await AxiosClient.delete(API_ROUTES.USERS.DELETE, { id })

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, message: data.message }
    }

    return { status, deleted: data.content as boolean }
  }
}
