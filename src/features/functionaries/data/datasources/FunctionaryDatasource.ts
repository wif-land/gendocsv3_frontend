import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { FunctionaryModel } from '../models/FunctionatyModel'
import { IFunctionary } from '../../domain/entities/IFunctionary'

export interface FunctionaryDataSource {
  getAll(): Promise<{
    status: number
    functionaries: FunctionaryModel[]
  }>

  update(funtionary: Partial<IFunctionary>): Promise<{
    status: number
  }>

  create(functionary: IFunctionary): Promise<{
    status: number
    functionary: FunctionaryModel
  }>
}

export class FunctionaryDataSourceImpl implements FunctionaryDataSource {
  static instance: FunctionaryDataSourceImpl

  static getInstance = (): FunctionaryDataSourceImpl => {
    if (!FunctionaryDataSourceImpl.instance) {
      FunctionaryDataSourceImpl.instance = new FunctionaryDataSourceImpl()
    }

    return FunctionaryDataSourceImpl.instance
  }

  create = async (functionary: FunctionaryModel) => {
    const result = await AxiosClient.post(
      API_ROUTES.FUNCTIONARIES.CREATE,
      functionary,
    )

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, functionary: {} as FunctionaryModel }
    }

    return { status, functionary: data.content as FunctionaryModel }
  }

  getAll = async () => {
    const result = await AxiosClient.get(API_ROUTES.FUNCTIONARIES.GET_ALL)

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, functionaries: [] as FunctionaryModel[] }
    }

    return { status, functionaries: data.content as FunctionaryModel[] }
  }

  update = async (career: Partial<IFunctionary>) => {
    const { id, ...body } = career

    const result = await AxiosClient.put(
      API_ROUTES.FUNCTIONARIES.UPDATE,
      body,
      {
        id,
      },
    )

    const { status } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status }
    }

    return { status }
  }
}
