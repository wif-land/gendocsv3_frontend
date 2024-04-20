import 'dotenv/config'
import { AxiosClient } from '../../../shared/utils/AxiosClient'
import { IModule } from '../types/IModule'
import { API_ROUTES } from '../../../shared/constants/appApiRoutes'

export const fetchModules = async (): Promise<IModule[]> => {
  const result = await AxiosClient.get(API_ROUTES.MODULES.GET_ALL)

  if ('error' in result) {
    return []
  }

  return result.data as IModule[]
}
