import { PositionModel } from '../../data/models/PositionModel'
import { PositionRepositoryImpl } from '../../data/repositories/PositionRepositoryImpl'
import { IPosition } from '../entities/IPosition'
import { FunctionaryRepository } from '../repositories/PositionRepository'

interface PositionUseCases {
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

export class PositionUseCasesImpl implements PositionUseCases {
  static instance: PositionUseCasesImpl

  static getInstance = (): PositionUseCasesImpl => {
    if (!PositionUseCasesImpl.instance) {
      PositionUseCasesImpl.instance = new PositionUseCasesImpl()
    }

    return PositionUseCasesImpl.instance
  }

  private functionaryRepository: FunctionaryRepository =
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
}
