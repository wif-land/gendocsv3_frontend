import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { PositionModel } from '../models/PositionModel'
import { IPosition } from '../../domain/entities/IPosition'

// Obtener todos paginado, por campo; crear, actualizar, eliminar

export interface PositionDataSource {
  getAll(
    limit: number,
    offset: number,
  ): Promise<{
    status: number
    data: {
      count: number
      positions: PositionModel[]
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
      positions: PositionModel[]
    }
  }>

  update(position: Partial<IPosition>): Promise<{
    status: number
    position: PositionModel
  }>

  create(position: IPosition): Promise<{
    status: number
    position: PositionModel
  }>

  delete(id: number): Promise<{
    status: number
    isDeleted: boolean
  }>

  deleteMany(ids: number[]): Promise<{
    status: number
    isDeleted: boolean
  }>
}

export class PositionDataSourceImpl implements PositionDataSource {
  static instance: PositionDataSourceImpl

  static getInstance = (): PositionDataSourceImpl => {
    if (!PositionDataSourceImpl.instance) {
      PositionDataSourceImpl.instance = new PositionDataSourceImpl()
    }

    return PositionDataSourceImpl.instance
  }

  getAll = async (limit: number, offset: number) => {
    const result = await AxiosClient.get(API_ROUTES.POSITIONS.GET_ALL, {
      params: { limit, offset },
    })

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.OK) {
      return {
        status,
        data: data.content as {
          count: number
          positions: PositionModel[]
        },
      }
    }

    return {
      status,
      data: { count: 0, positions: [] as PositionModel[] },
    }
  }

  getByField = async (field: string, limit: number, offset: number) => {
    const result = await AxiosClient.get(
      API_ROUTES.POSITIONS.GET_BY_FIELD(field),
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
          positions: PositionModel[]
        },
      }
    }

    return {
      status,
      data: { count: 0, positions: [] as PositionModel[] },
    }
  }

  update = async (position: Partial<IPosition>) => {
    const { id, ...body } = position

    const result = await AxiosClient.patch(
      API_ROUTES.POSITIONS.UPDATE(id as number),
      body,
    )

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.OK) {
      return { status, position: data.content as PositionModel }
    }

    return { status, position: {} as PositionModel }
  }

  create = async (position: PositionModel) => {
    const result = await AxiosClient.post(API_ROUTES.POSITIONS.CREATE, position)

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, position: {} as PositionModel }
    }

    return { status, position: data.content as PositionModel }
  }

  delete = async (id: number) => {
    const result = await AxiosClient.delete({
      path: API_ROUTES.POSITIONS.DELETE(id),
    })

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.OK) {
      return { status, isDeleted: data.content as boolean }
    }

    return { status, isDeleted: false }
  }

  deleteMany = async (ids: number[]) => {
    const result = await AxiosClient.delete({
      path: API_ROUTES.POSITIONS.DELETE_MANY,
      body: ids,
    })

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.OK) {
      return { status, isDeleted: data.content as boolean }
    }

    return { status, isDeleted: false }
  }
}
