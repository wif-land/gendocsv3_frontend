import 'dotenv/config'
import { AxiosClient } from '../../../shared/utils/AxiosClient'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'
import { API_ROUTES } from '../../../shared/constants/appApiRoutes'
import { IFunctionary } from '../types/IFunctionary'

export class FunctionariesApi {
  static fetchFunctionaries = async (): Promise<{
    status: number
    functionaries?: IFunctionary[]
  }> => {
    const result = await AxiosClient.get(API_ROUTES.FUNCTIONARIES.GET_ALL)

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) return { status }

    return { status, functionaries: data.content as IFunctionary[] }
  }

  static updateFunctionary = async (
    id: string,
    data: Partial<IFunctionary>,
  ): Promise<{ status: number }> => {
    const result = await AxiosClient.put(
      API_ROUTES.FUNCTIONARIES.UPDATE.replace(':id', id),
      data,
    )

    const { status } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) return { status }

    return { status }
  }

  static createFunctionary = async (
    data: IFunctionary,
  ): Promise<{ status: number }> => {
    const result = await AxiosClient.post(API_ROUTES.FUNCTIONARIES.CREATE, data)

    const { status } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) return { status }

    return { status }
  }
}
