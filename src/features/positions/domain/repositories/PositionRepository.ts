import { PositionModel } from '../../data/models/PositionModel'
import { IPosition } from '../entities/IPosition'

export interface PositionRepository {
  getAll(
    limit: number,
    offset: number,
  ): Promise<{
    count: number,
    positions: PositionModel[]
  }>

  getByField(
    field: string,
    limit: number,
    offset: number,
  ): Promise<{
    count: number
    positions: PositionModel[]
  }>

  update(position: Partial<IPosition>): Promise<PositionModel>

  create(position: IPosition): Promise<PositionModel>

  delete(id: number): Promise<boolean>

  deleteMany(ids: number[]): Promise<boolean>
}
