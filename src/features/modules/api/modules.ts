import 'dotenv/config'
import { jwtDecode } from 'jwt-decode'
import { AxiosClient } from '../../../shared/utils/AxiosClient'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'
import { setCookie } from '../../../shared/utils/CookiesUtil'
import { IModule } from '../types/IModule'

export const fetchModules = async (
): Promise<{
  status: number
  message?: string
  modules?: IModule[]
}> => {
  const result = await AxiosClient.get('/modules')

  const {
    status,
    data: { message, data },
  } = result as unknown as {
    status: number
    data: {
      message: string
      data: IModule[]
    }
}   
      if (status === HTTP_STATUS_CODES.UNAUTHORIZED) return { status, message }
    
      return { status, modules: data }

      
}
