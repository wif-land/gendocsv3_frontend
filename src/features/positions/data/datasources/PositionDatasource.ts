import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { PositionModel } from '../models/PositionModel'
import { IPosition } from '../../domain/entities/IPosition'
import { PaginationDTO } from '../../../../shared/utils/pagination-dto'

export interface PositionDataSource {
  getAll(pagination?: PaginationDTO): Promise<{
    count: number
    positions: PositionModel[]
  }>

  getByField(
    field: string,
    pagination?: PaginationDTO,
  ): Promise<{
    count: number
    positions: PositionModel[]
  }>

  update(position: Partial<IPosition>): Promise<PositionModel>

  create(position: IPosition): Promise<PositionModel>

  delete(id: number): Promise<boolean>

  deleteMany(ids: number[]): Promise<boolean>
}

export class PositionDataSourceImpl implements PositionDataSource {
  static instance: PositionDataSourceImpl

  static getInstance = (): PositionDataSourceImpl => {
    if (!PositionDataSourceImpl.instance) {
      PositionDataSourceImpl.instance = new PositionDataSourceImpl()
    }

    return PositionDataSourceImpl.instance
  }

  getAll = async (pagination: PaginationDTO) => {
    const result = await AxiosClient.get(API_ROUTES.POSITIONS.GET_ALL, {
      params: { ...pagination },
    })

    if ('error' in result) {
      return {
        count: 0,
        positions: [],
      }
    }

    return result.data as {
      count: number
      positions: PositionModel[]
    }
  }

  getByField = async (field: string, pagination: PaginationDTO) => {
    const result = await AxiosClient.get(
      API_ROUTES.POSITIONS.GET_BY_FIELD(field),
      {
        params: { ...pagination },
      },
    )

    if ('error' in result) {
      return { count: 0, positions: [] as PositionModel[] }
    }

    return result.data as {
      count: number
      positions: PositionModel[]
    }
  }

  update = async (position: Partial<IPosition>) => {
    const { id, ...body } = position

    const result = await AxiosClient.patch(
      API_ROUTES.POSITIONS.UPDATE(id as number),
      body,
    )

    if ('error' in result) {
      return {} as PositionModel
    }

    return result.data as PositionModel
  }

  create = async (position: PositionModel) => {
    const result = await AxiosClient.post(API_ROUTES.POSITIONS.CREATE, position)

    if ('error' in result) {
      return {} as PositionModel
    }

    return result.data as PositionModel
  }

  delete = async (id: number) => {
    const result = await AxiosClient.delete({
      path: API_ROUTES.POSITIONS.DELETE(id),
    })

    if ('error' in result) {
      return false
    }

    return result.data as boolean
  }

  deleteMany = async (ids: number[]) => {
    const result = await AxiosClient.delete({
      path: API_ROUTES.POSITIONS.DELETE_MANY,
      body: ids,
    })

    if ('error' in result) {
      return false
    }

    return result.data as boolean
  }
}
