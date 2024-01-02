import 'dotenv/config'
import { AxiosClient } from '../../../shared/utils/AxiosClient'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'
import { IUser } from '../../auth/types/IUser'

export const fetchUsers = async (): Promise<{
  status: number
  message?: string
  users?: IUser[]
}> => {
  const result = await AxiosClient.get('/users')

  const {
    status,
    data: { message, data },
  } = result as unknown as {
    status: number
    data: {
      message: string
      data: IUser[]
    }
  }
  if (status === HTTP_STATUS_CODES.UNAUTHORIZED) return { status, message }

  return { status, users: data }
}
