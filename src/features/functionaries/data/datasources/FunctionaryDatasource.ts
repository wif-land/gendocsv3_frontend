import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { FunctionaryModel } from '../models/FunctionatyModel'
import { IFunctionary } from '../../domain/entities/IFunctionary'

export interface FunctionaryDataSource {
  getAll(
    limit: number,
    offset: number,
  ): Promise<{
    status: number
    data: {
      count: number
      functionaries: FunctionaryModel[]
    }
  }>

  getByField(
    field: string,
    limit: number,
    offset: number,
  ): Promise<{
    status: number
    data: {
      count: number
      functionaries: FunctionaryModel[]
    }
  }>

  update(functionary: Partial<IFunctionary>): Promise<{
    status: number
    functionary: FunctionaryModel
  }>

  bulkUpdate(functionaries: Partial<IFunctionary>[]): Promise<{
    status: number
    functionaries: FunctionaryModel[]
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

  getAll = async (limit: number, offset: number) => {
    const result = await AxiosClient.get(API_ROUTES.FUNCTIONARIES.GET_ALL, {
      params: { limit, offset },
    })

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.OK) {
      return {
        status,
        data: data.content as {
          count: number
          functionaries: FunctionaryModel[]
        },
      }
    }

    return {
      status,
      data: { count: 0, functionaries: [] as FunctionaryModel[] },
    }
  }

  getByField = async (field: string, limit: number, offset: number) => {
    const result = await AxiosClient.get(
      API_ROUTES.FUNCTIONARIES.GET_BY_FIELD(field),
      {
        params: { limit, offset },
      },
    )

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.OK) {
      return {
        status,
        data: data.content as {
          count: number
          functionaries: FunctionaryModel[]
        },
      }
    }

    return {
      status,
      data: { count: 0, functionaries: [] as FunctionaryModel[] },
    }
  }

  update = async (functionary: Partial<IFunctionary>) => {
    const { id, ...body } = functionary

    const result = await AxiosClient.patch(
      API_ROUTES.FUNCTIONARIES.UPDATE(id as number),
      body,
    )

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.OK) {
      return { status, functionary: data.content as FunctionaryModel }
    }

    return { status, functionary: {} as FunctionaryModel }
  }

  bulkUpdate = async (functionaries: Partial<IFunctionary>[]) => {
    const result = await AxiosClient.patch(
      API_ROUTES.FUNCTIONARIES.BULK_UPDATE,
      functionaries,
    )

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.OK) {
      return { status, functionaries: data.content as FunctionaryModel[] }
    }

    return { status, functionaries: [] as FunctionaryModel[] }
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
}
