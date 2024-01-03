import { API_ROUTES } from '../../../shared/constants/appApiRoutes'
import { AxiosClient } from '../../../shared/utils/AxiosClient'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'
import { ICareer } from '../interfaces/ICareer'

export class CareerApi {
  static getCareers = async (): Promise<{
    status: number
    careers?: ICareer[]
  }> => {
    const result = await AxiosClient.get(API_ROUTES.CAREERS.GET_ALL)

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) return { status }

    return { status, careers: data.content as ICareer[] }
  }

  static update = async (
    id: number,
    data: Partial<ICareer>,
  ): Promise<{ status: number }> => {
    const result = await AxiosClient.put(API_ROUTES.CAREERS.UPDATE, data, {
      id,
    })

    const { status } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) return { status }

    return { status }
  }

  static create = async (
    careerData: ICareer,
  ): Promise<{ status: number; career?: ICareer }> => {
    const result = await AxiosClient.post(API_ROUTES.CAREERS.CREATE, careerData)

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) return { status }

    return { status, career: data.content as ICareer }
  }
}
