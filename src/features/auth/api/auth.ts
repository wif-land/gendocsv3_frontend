import 'dotenv/config'
import { jwtDecode } from 'jwt-decode'
import { IUser } from '../types/IUser'
import { AxiosClient } from '../../../shared/utils/AxiosClient'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'
import { setCookie } from '../../../shared/utils/CookiesUtil'
import {
  ACCESS_TOKEN_COOKIE_NAME,
  API_ROUTES,
} from '../../../shared/constants/appApiRoutes'

export const login = async (
  email: string,
  password: string,
): Promise<{
  status: number
  message?: string
  decoded?: IUser
}> => {
  const result = await AxiosClient.post<{
    accessToken: string
  }>(API_ROUTES.AUTH.LOGIN, { email, password })

  const {
    status,
    data: { message, content },
  } = result

  if (status === HTTP_STATUS_CODES.UNAUTHORIZED) return { status, message }

  setCookie(ACCESS_TOKEN_COOKIE_NAME, content!.accessToken)

  const decoded: IUser = jwtDecode(content!.accessToken)

  return { status, decoded }
}
