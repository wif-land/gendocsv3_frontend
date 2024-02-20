import { PositionModel } from '../../data/models/PositionModel'
import { IPosition } from '../entities/IPosition'

export interface FunctionaryRepository {
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
}
