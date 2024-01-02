import 'dotenv/config'
import { AxiosClient } from '../../../shared/utils/AxiosClient'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'
import { IModule } from '../types/IModule'

export const fetchModules = async (): Promise<{
  status: number
  message?: string
  modules?: IModule[]
}> => {
  const result = await AxiosClient.get<IModule[]>('/modules')

  const { status, data } = result

  if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
    return { status, message: data?.message }
  }

  return { status, modules: data?.content }
}
