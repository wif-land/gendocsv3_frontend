import 'dotenv/config'
import { AxiosClient } from '../../../shared/utils/AxiosClient'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'
import { API_ROUTES } from '../../../shared/constants/appApiRoutes'
import { IFunctionary } from '../domain/entities/IFunctionary'

export class FunctionariesApi {
  static fetchFunctionaries = async (): Promise<{
    status: number
    functionaries?: IFunctionary[]
    message?: string
  }> => {
    const result = await AxiosClient.get(API_ROUTES.FUNCTIONARIES.GET_ALL)

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, message: data?.message }
    }

    return { status, functionaries: data.content as IFunctionary[] }
  }

  static updateFunctionary = async (
    id: number,
    body: Partial<IFunctionary>,
  ): Promise<{
    status: number
    functionary?: IFunctionary
    message?: string
  }> => {
    const result = await AxiosClient.put(
      API_ROUTES.FUNCTIONARIES.UPDATE,
      body,
      {
        id,
      },
    )

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, message: result.data?.message }
    }

    return { status, functionary: data.content as IFunctionary }
  }

  static createFunctionary = async (
    body: IFunctionary,
  ): Promise<{
    status: number
    functionary?: IFunctionary
    message?: string
  }> => {
    const result = await AxiosClient.post(API_ROUTES.FUNCTIONARIES.CREATE, body)

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, message: data?.message }
    }

    return { status, functionary: data.content as IFunctionary }
  }
}
