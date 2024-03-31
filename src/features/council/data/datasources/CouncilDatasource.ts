import { CouncilModel } from '../models/CouncilModel'
import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { ICouncil } from '../../domain/entities/ICouncil'

export interface CouncilsDataSource {
  getAll(): Promise<{
    status: number
    councils: CouncilModel[]
  }>

  getAllCouncilsByModuleId(
    moduleId: number,
    limit: number,
    offset: number,
  ): Promise<{
    status: number
    data: {
      councils: CouncilModel[]
      count: number
    }
  }>

  getByField(
    field: string,
    moduleId: number,
    limit: number,
    offset: number,
  ): Promise<{
    status: number
    data: {
      councils: CouncilModel[]
      count: number
    }
  }>

  update(council: Partial<ICouncil>): Promise<{
    status: number
    council: CouncilModel
  }>

  create(council: ICouncil): Promise<{
    status: number
    council: CouncilModel
  }>

  bulkUpdate(councils: Partial<ICouncil>[]): Promise<{
    status: number
    councils: CouncilModel[]
  }>
}

export class CouncilsDataSourceImpl implements CouncilsDataSource {
  static instance: CouncilsDataSourceImpl

  static getInstance = (): CouncilsDataSourceImpl => {
    if (!CouncilsDataSourceImpl.instance) {
      CouncilsDataSourceImpl.instance = new CouncilsDataSourceImpl()
    }

    return CouncilsDataSourceImpl.instance
  }

  getAllCouncilsByModuleId = async (
    moduleId: number,
    limit: number,
    offset: number,
  ) => {
    const result = await AxiosClient.get(API_ROUTES.COUNCILS.GET_ALL, {
      params: { moduleId, limit, offset },
    })

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        data: { councils: [], count: 0 },
      }
    }

    const { status, data } = result

    return {
      status,
      data: data.content as { councils: CouncilModel[]; count: number },
    }
  }

  create = async (council: CouncilModel) => {
    const result = await AxiosClient.post(API_ROUTES.COUNCILS.CREATE, council)

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        council: {} as CouncilModel,
      }
    }

    const { status, data } = result

    return { status, council: data.content as CouncilModel }
  }

  getAll = async () => {
    const result = await AxiosClient.get(API_ROUTES.COUNCILS.GET_ALL)

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        councils: [] as CouncilModel[],
      }
    }

    const { status, data } = result

    return { status, councils: data.content as CouncilModel[] }
  }

  getByField = async (
    field: string,
    moduleId: number,
    limit: number,
    offset: number,
  ) => {
    const result = await AxiosClient.get(
      API_ROUTES.COUNCILS.GET_BY_FIELD(field),
      {
        params: { moduleId, limit, offset },
      },
    )

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        data: { councils: [], count: 0 },
      }
    }
    const { status, data } = result

    return {
      status,
      data: data.content as { councils: CouncilModel[]; count: number },
    }
  }

  update = async (council: ICouncil) => {
    const { id, ...rest } = council
    const result = await AxiosClient.patch(
      API_ROUTES.COUNCILS.UPDATE(id as number),
      rest,
    )

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        council: {} as CouncilModel,
      }
    }

    const { status, data } = result

    return { status, council: data.content as CouncilModel }
  }

  bulkUpdate = async (councils: ICouncil[]) => {
    const result = await AxiosClient.patch(
      API_ROUTES.COUNCILS.BULK_UPDATE,
      councils,
    )

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        councils: [] as CouncilModel[],
      }
    }

    const { status, data } = result

    return { status, councils: data.content as CouncilModel[] }
  }
}
