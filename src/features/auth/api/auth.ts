import 'dotenv/config'
import { jwtDecode } from 'jwt-decode'
import { IAccountUser } from '../types/IUserAccount'
import { AxiosClient } from '../utils/AxiosClient'
import { setCookie } from '../../../shared/utils/CookiesUtil'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'

export const login = async (
  email: string,
  password: string,
): Promise<{
  status: number
  message?: string
  decoded?: IAccountUser
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

  setCookie('accessToken', content!.accessToken, 1)

  const decoded: IAccountUser = jwtDecode(content!.accessToken)

  return { status, decoded }
}

// TODO: GUARDAR TOKEN EN COOKIE Y USUARIO EN ESTADO GLOBAL
