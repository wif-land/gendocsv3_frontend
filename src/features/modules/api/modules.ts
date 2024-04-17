import 'dotenv/config'
import { AxiosClient } from '../../../shared/utils/AxiosClient'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'
import { IModule } from '../types/IModule'
import { API_ROUTES } from '../../../shared/constants/appApiRoutes'

export const fetchModules = async (): Promise<IModule[]> => {
  const result = await AxiosClient.get(API_ROUTES.MODULES.GET_ALL)

  if ('error' in result) {
    return []
  }

  return result.data as IModule[]
}
