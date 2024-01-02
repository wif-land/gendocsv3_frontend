import 'dotenv/config'
import { AxiosClient } from '../../../shared/utils/AxiosClient'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'
import { IModule } from '../types/IModule'
import { API_ROUTES } from '../../../shared/constants/appApiRoutes'

export const fetchModules = async (): Promise<{
  status: number
  message?: string
  modules?: IModule[]
}> => {
  const result = await AxiosClient.get<{
    data: IModule[]
  }>(API_ROUTES.MODULES.GET_ALL)

  const { status, data } = result

  if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
    return { status, message: data?.message }
  }

  return { status, modules: data?.content.data }
}
