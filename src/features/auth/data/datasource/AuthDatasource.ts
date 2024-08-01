import { jwtDecode } from 'jwt-decode'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { AxiosClient } from '../../../../shared/utils/AxiosClient'
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

  recoverPassword: (email: string) => Promise<boolean>

  newPassword: (email: string, password: string) => Promise<boolean>

  resendEmail: (email: string) => Promise<boolean>
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

    const userData: IUserPayload = jwtDecode(data as string)

    const { sub, ...userWithoutSub } = userData

    return { decoded: { ...userWithoutSub, id: sub, sub } }
  }

  logout = async () => {
    await AxiosClient.post(API_ROUTES.AUTH.LOGOUT)

    return {
      status: HTTP_STATUS_CODES.OK,
      message: 'Sesión cerrada',
    }
  }

  recoverPassword = async (email: string) => {
    const result = await AxiosClient.post(API_ROUTES.AUTH.RECOVER_PASSWORD, {
      email,
    })

    if ('error' in result) {
      return false
    }

    return true
  }

  newPassword = async (email: string, password: string) => {
    const result = await AxiosClient.post(API_ROUTES.AUTH.NEW_PASSWORD, {
      email,
      password,
    })

    if ('error' in result) {
      return false
    }

    return true
  }

  resendEmail = async (email: string) => {
    const result = await AxiosClient.post(API_ROUTES.AUTH.RESEND_EMAIL, {
      email,
    })

    if ('error' in result) {
      return false
    }

    return true
  }
}
