import 'dotenv/config'
import { jwtDecode } from 'jwt-decode'
import { IUser } from '../types/IUser'
import { AxiosClient } from '../../../shared/utils/AxiosClient'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'
import { setCookie } from '../../../shared/utils/CookiesUtil'

export const login = async (
  email: string,
  password: string,
): Promise<{
  status: number
  message?: string
  decoded?: IUser
}> => {
  const result = await AxiosClient.post('/auth/login', { email, password })

  const {
    status,
    data: { message, content },
  } = result as {
    status: number
    data: {
      message: string
      content: { accessToken: string }
    }
  }

  if (status === HTTP_STATUS_CODES.UNAUTHORIZED) return { status, message }

  setCookie('access_token', content!.accessToken)

  const decoded: IUser = jwtDecode(content!.accessToken)

  return { status, decoded }
}
