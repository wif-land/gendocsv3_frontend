import 'dotenv/config'
import { AxiosClient } from '../../../shared/utils/AxiosClient'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'
import { ICreateUser, IUser } from '../../auth/types/IUser'
import { API_ROUTES } from '../../../shared/constants/appApiRoutes'
import { IUpdateUser } from '../types/IUserUpdate'

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
    data: IUpdateUser,
  ): Promise<{ status: number }> => {
    const result = await AxiosClient.put(API_ROUTES.USERS.UPDATE, data, {
      id,
    })

    const { status } = result

    console.log(result)

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) return { status }

    return { status }
  }

  static createUser = async (
    body: Partial<ICreateUser>,
  ): Promise<{
    status: number
    data?: { message: string; content: unknown }
  }> => {
    const result = await AxiosClient.post(API_ROUTES.USERS.CREATE, body)

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) return { status }

    return { status, data }
  }

  static deleteUser = async (id: string): Promise<{ status: number }> => {
    const result = await AxiosClient.delete(API_ROUTES.USERS.DELETE, { id })

    const { status } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) return { status }

    return { status }
  }
}
