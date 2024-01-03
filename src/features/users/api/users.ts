import 'dotenv/config'
import { AxiosClient } from '../../../shared/utils/AxiosClient'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'
import { ICreateUser, IUser } from '../../auth/types/IUser'
import { API_ROUTES } from '../../../shared/constants/appApiRoutes'
import { create } from 'zustand'

export class UsersApi {
  static fetchUsers = async (): Promise<{
    status: number
    users?: IUser[]
  }> => {
    const result = await AxiosClient.get(API_ROUTES.USERS.GET_ALL)

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) return { status }

    return { status, users: data.content as IUser[] }
  }

  static updateUser = async (
    id: string,
    data: Partial<IUser>,
  ): Promise<{ status: number }> => {
    const result = await AxiosClient.put(API_ROUTES.USERS.UPDATE, data, {
      id,
    })

    const { status } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) return { status }

    return { status }
  }

  static createUser = async (
    data: Partial<ICreateUser>,
  ): Promise<{ status: number }> => {
    const result = await AxiosClient.post(API_ROUTES.USERS.CREATE, data)

    const { status } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) return { status }

    return { status }
  }
}
