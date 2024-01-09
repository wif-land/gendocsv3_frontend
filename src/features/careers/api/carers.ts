import 'dotenv/config'
import { AxiosClient } from '../../../shared/utils/AxiosClient'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'
import { API_ROUTES } from '../../../shared/constants/appApiRoutes'
import { ICareer } from '../types/ICareer'

export class CareersApi {
  static fetchCareers = async (): Promise<{
    status: number
    careers?: ICareer[]
  }> => {
    const result = await AxiosClient.get(API_ROUTES.CAREERS.GET_ALL)

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) return { status }

    return { status, careers: data.content as ICareer[] }
  }
}
