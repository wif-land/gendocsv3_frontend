import { PositionModel } from '../../data/models/PositionModel'
import { PositionRepositoryImpl } from '../../data/repositories/PositionRepositoryImpl'
import { IPosition } from '../entities/IPosition'
import { PositionRepository } from '../repositories/PositionRepository'

interface PositionUseCases {
  getAll(
    limit: number,
    offset: number,
  ): Promise<{
    count: number
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

export class PositionUseCasesImpl implements PositionUseCases {
  static instance: PositionUseCasesImpl

  static getInstance = (): PositionUseCasesImpl => {
    if (!PositionUseCasesImpl.instance) {
      PositionUseCasesImpl.instance = new PositionUseCasesImpl()
    }

    return PositionUseCasesImpl.instance
  }

  private functionaryRepository: PositionRepository =
    PositionRepositoryImpl.getInstance()

  getAll = async (limit: number, offset: number) =>
    this.functionaryRepository.getAll(limit, offset)

  getByField = async (field: string, limit: number, offset: number) =>
    this.functionaryRepository.getByField(field, limit, offset)

  update = async (position: Partial<IPosition>) =>
    this.functionaryRepository.update(position)

  create = async (position: IPosition) =>
    this.functionaryRepository.create(position)

  delete = async (id: number) => this.functionaryRepository.delete(id)

  deleteMany = async (ids: number[]) =>
    this.functionaryRepository.deleteMany(ids)
}
