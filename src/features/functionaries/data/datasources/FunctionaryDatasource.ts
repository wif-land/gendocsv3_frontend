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

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        data: { count: 0, functionaries: [] as FunctionaryModel[] },
      }
    }

    const { status, data } = result

    return {
      status,
      data: data.content as {
        count: number
        functionaries: FunctionaryModel[]
      },
    }
  }

  getByField = async (field: string, limit: number, offset: number) => {
    const result = await AxiosClient.get(
      API_ROUTES.FUNCTIONARIES.GET_BY_FIELD(field),
      {
        params: { limit, offset },
      },
    )

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        data: { count: 0, functionaries: [] as FunctionaryModel[] },
      }
    }

    const { status, data } = result

    return {
      status,
      data: data.content as {
        count: number
        functionaries: FunctionaryModel[]
      },
    }
  }

  update = async (functionary: Partial<IFunctionary>) => {
    const { id, ...body } = functionary

    const result = await AxiosClient.patch(
      API_ROUTES.FUNCTIONARIES.UPDATE(id as number),
      body,
    )

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        functionary: {} as FunctionaryModel,
      }
    }

    const { status, data } = result

    return { status, functionary: data.content as FunctionaryModel }
  }

  bulkUpdate = async (functionaries: Partial<IFunctionary>[]) => {
    const result = await AxiosClient.patch(
      API_ROUTES.FUNCTIONARIES.BULK_UPDATE,
      functionaries,
    )

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        functionaries: [] as FunctionaryModel[],
      }
    }

    const { status, data } = result

    return { status, functionaries: data.content as FunctionaryModel[] }
  }

  create = async (functionary: FunctionaryModel) => {
    const result = await AxiosClient.post(
      API_ROUTES.FUNCTIONARIES.CREATE,
      functionary,
    )

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        functionary: {} as FunctionaryModel,
      }
    }

    const { status, data } = result

    return { status, functionary: data.content as FunctionaryModel }
  }
}
