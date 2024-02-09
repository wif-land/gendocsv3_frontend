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
    status: number
    message?: string
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
    const result = await AxiosClient.post<{
      accessToken: string
    }>(API_ROUTES.AUTH.LOGIN, { email, password })

    const {
      status,
      data: { message, content },
    } = result

    if (status !== HTTP_STATUS_CODES.CREATED) return { status, message }

    await setCookie(ACCESS_TOKEN_COOKIE_NAME, content!.accessToken)

    const userData: IUserPayload = jwtDecode(content!.accessToken)

    const { sub, ...userWithoutSub } = userData

    return { status, decoded: { ...userWithoutSub, id: sub, sub } }
  }

  logout = () => AxiosClient.get(API_ROUTES.AUTH.LOGOUT)
}
