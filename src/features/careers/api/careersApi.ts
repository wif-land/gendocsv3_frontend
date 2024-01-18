import { API_ROUTES } from '../../../shared/constants/appApiRoutes'
import { AxiosClient } from '../../../shared/utils/AxiosClient'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'
import { ICareer } from '../domain/entities/ICareer'

export class CareerApi {
  static getCareers = async (): Promise<{
    status: number
    careers?: ICareer[]
    message?: string
  }> => {
    const result = await AxiosClient.get(API_ROUTES.CAREERS.GET_ALL)

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, message: data.message }
    }

    return { status, careers: data.content as ICareer[] }
  }

  static update = async (
    id: number,
    body: Partial<ICareer>,
  ): Promise<{
    status: number
    data?: ICareer
    message?: string
  }> => {
    const result = await AxiosClient.put(API_ROUTES.CAREERS.UPDATE, body, {
      id,
    })

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, message: data?.message }
    }

    return { status, data: data?.content as ICareer }
  }

  static create = async (
    careerData: ICareer,
  ): Promise<{ status: number; career?: ICareer; message?: string }> => {
    const result = await AxiosClient.post(API_ROUTES.CAREERS.CREATE, careerData)

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, message: data?.message }
    }

    return { status, career: data.content as ICareer }
  }
}
