import { IPosition } from '../../domain/entities/IPosition'
import { PositionRepository } from '../../domain/repositories/PositionRepository'
import {
  PositionDataSource,
  PositionDataSourceImpl,
} from '../datasources/PositionDatasource'

export class PositionRepositoryImpl implements PositionRepository {
  static instance: PositionRepositoryImpl

  static getInstance = (): PositionRepositoryImpl => {
    if (!PositionRepositoryImpl.instance) {
      PositionRepositoryImpl.instance = new PositionRepositoryImpl(
        PositionDataSourceImpl.getInstance(),
      )
    }

    return PositionRepositoryImpl.instance
  }

  private constructor(private readonly datasource: PositionDataSource) {}

  getAll = async (limit: number, offset: number) =>
    this.datasource.getAll(limit, offset)

  getByField = async (field: string, limit: number, offset: number) =>
    this.datasource.getByField(field, limit, offset)

  update = async (position: Partial<IPosition>) =>
    this.datasource.update(position)

  create = async (position: IPosition) => this.datasource.create(position)

  delete = async (id: number) => this.datasource.delete(id)

  deleteMany = async (ids: number[]) => this.datasource.deleteMany(ids)
}
