import 'dotenv/config'
import { AxiosClient } from '../../../shared/utils/AxiosClient'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'
import { IResponseUser } from '../../auth/types/IUser'

export const fetchUsers = async (): Promise<{
  status: number
  users?: IResponseUser[]
}> => {
  const result = await AxiosClient.get('/users')

  const {
    status,
    data: { data },
  } = result as unknown as {
    status: number
    data: {
      message: string
      data: IResponseUser[]
    }
  }
  if (status === HTTP_STATUS_CODES.UNAUTHORIZED) return { status, users: data }

  return { status, users: data }
}
