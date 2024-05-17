import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { FunctionaryModel } from '../models/FunctionatyModel'
import { IFunctionary } from '../../domain/entities/IFunctionary'
import { IFunctionaryFilters } from '../../domain/entities/IFunctionaryFilters'

export interface FunctionaryDataSource {
  getAll(
    limit: number,
    offset: number,
  ): Promise<{
    count: number
    functionaries: FunctionaryModel[]
  }>

  getByFilters(
    filters: IFunctionaryFilters,
    limit: number,
    offset: number,
  ): Promise<{
    count: number
    functionaries: FunctionaryModel[]
  }>

  update(functionary: Partial<IFunctionary>): Promise<FunctionaryModel>

  bulkUpdate(
    functionaries: Partial<IFunctionary>[],
  ): Promise<FunctionaryModel[]>

  create(functionary: IFunctionary): Promise<FunctionaryModel>
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
      return { count: 0, functionaries: [] as FunctionaryModel[] }
    }

    return result.data as {
      count: number
      functionaries: FunctionaryModel[]
    }
  }

  getByFilters = async (
    filters: IFunctionaryFilters,
    limit: number,
    offset: number,
  ) => {
    const result = await AxiosClient.get(
      API_ROUTES.FUNCTIONARIES.GET_BY_FILTERS,
      {
        params: { limit, offset, ...filters },
      },
    )

    if ('error' in result) {
      return { count: 0, functionaries: [] as FunctionaryModel[] }
    }

    return result.data as {
      count: number
      functionaries: FunctionaryModel[]
    }
  }

  update = async (functionary: Partial<IFunctionary>) => {
    const { id, ...body } = functionary

    const result = await AxiosClient.patch(
      API_ROUTES.FUNCTIONARIES.UPDATE(id as number),
      body,
    )

    if ('error' in result) {
      return {} as FunctionaryModel
    }

    return result.data as FunctionaryModel
  }

  bulkUpdate = async (functionaries: Partial<IFunctionary>[]) => {
    const result = await AxiosClient.patch(
      API_ROUTES.FUNCTIONARIES.BULK_UPDATE,
      functionaries,
    )

    if ('error' in result) {
      return [] as FunctionaryModel[]
    }

    return result.data as FunctionaryModel[]
  }

  create = async (functionary: FunctionaryModel) => {
    const result = await AxiosClient.post(
      API_ROUTES.FUNCTIONARIES.CREATE,
      functionary,
    )

    if ('error' in result) {
      return {} as FunctionaryModel
    }

    return result.data as FunctionaryModel
  }
}
