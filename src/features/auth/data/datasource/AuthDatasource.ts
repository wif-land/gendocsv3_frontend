import { jwtDecode } from 'jwt-decode'
import {
  ACCESS_TOKEN_COOKIE_NAME,
  API_ROUTES,
} from '../../../../shared/constants/appApiRoutes'
import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { setCookie } from '../../../../shared/utils/CookiesUtil'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { IUser, IUserPayload } from '../../domain/entities/IUser'

export interface AuthDataSource {
  login: (
    email: string,
    password: string,
  ) => Promise<{
    decoded?: IUser
  }>

  logout: () => Promise<{
    status: number
    message?: string
  }>
}

export class AuthDataSourceImpl implements AuthDataSource {
  static instance: AuthDataSourceImpl

  static getInstance = (): AuthDataSourceImpl => {
    if (!AuthDataSourceImpl.instance) {
      AuthDataSourceImpl.instance = new AuthDataSourceImpl()
    }

    return AuthDataSourceImpl.instance
  }

  login = async (email: string, password: string) => {
    const result = await AxiosClient.post(API_ROUTES.AUTH.LOGIN, {
      email,
      password,
    })

    if ('error' in result) {
      return { status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR }
    }

    const { data } = result

    await setCookie(ACCESS_TOKEN_COOKIE_NAME, data)

    const userData: IUserPayload = jwtDecode(data as string)

    const { sub, ...userWithoutSub } = userData

    return { decoded: { ...userWithoutSub, id: sub, sub } }
  }

  logout = async () => {
    await setCookie(ACCESS_TOKEN_COOKIE_NAME, '')
    return {
      status: HTTP_STATUS_CODES.OK,
      message: 'Sesión cerrada',
    }
  }
}
