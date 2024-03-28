import { CouncilModel } from '../models/CouncilModel'
import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { ICouncil } from '../../domain/entities/ICouncil'
import { ICouncilFilters } from '../../domain/entities/ICouncilFilters'

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

  getByFilters(
    moduleId: number,
    limit: number,
    offset: number,
    filters: ICouncilFilters,
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

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.OK) {
      return {
        status,
        data: data.content as { councils: CouncilModel[]; count: number },
      }
    }
    return { status, data: { councils: [], count: 0 } }
  }

  create = async (council: CouncilModel) => {
    const result = await AxiosClient.post(API_ROUTES.COUNCILS.CREATE, council)

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.CREATED) {
      return { status, council: data.content as CouncilModel }
    }
    return { status, council: {} as CouncilModel }
  }

  getAll = async () => {
    const result = await AxiosClient.get(API_ROUTES.COUNCILS.GET_ALL)

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.OK) {
      return { status, councils: data.content as CouncilModel[] }
    }
    return { status, councils: [] as CouncilModel[] }
  }

  getByFilters = async (
    moduleId: number,
    limit: number,
    offset: number,
    filters: ICouncilFilters,
  ) => {
    const result = await AxiosClient.get(API_ROUTES.COUNCILS.GET_BY_FILTERS, {
      params: { moduleId, limit, offset, ...filters },
    })

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.OK) {
      return {
        status,
        data: data.content as { councils: CouncilModel[]; count: number },
      }
    }
    return { status, data: { councils: [], count: 0 } }
  }

  update = async (council: ICouncil) => {
    const { id, ...rest } = council
    const result = await AxiosClient.patch(
      API_ROUTES.COUNCILS.UPDATE(id as number),
      rest,
    )

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.OK) {
      return { status, council: data.content as CouncilModel }
    }
    return { status, council: {} as CouncilModel }
  }

  bulkUpdate = async (councils: ICouncil[]) => {
    const result = AxiosClient.patch(API_ROUTES.COUNCILS.BULK_UPDATE, councils)

    return result.then(({ status, data }) => {
      if (status === HTTP_STATUS_CODES.OK) {
        return { status, councils: data.content as CouncilModel[] }
      }
      return { status, councils: [] as CouncilModel[] }
    })
  }
}
