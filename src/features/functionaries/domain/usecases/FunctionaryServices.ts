import { FunctionaryModel } from '../../data/models/FunctionatyModel'
import { FunctionaryRepositoryImpl } from '../../data/repositories/FunctionaryRepositoryImpl'
import { IFunctionary } from '../entities/IFunctionary'
import { IFunctionaryFilters } from '../entities/IFunctionaryFilters'
import { FunctionaryRepository } from '../repositories/FunctionaryRepository'

interface FunctionaryUseCases {
  create(data: IFunctionary): Promise<FunctionaryModel>

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

  update(id: number, data: Partial<FunctionaryModel>): Promise<FunctionaryModel>

  bulkUpdate(
    functionaries: Partial<IFunctionary>[],
  ): Promise<FunctionaryModel[]>
}

export class FunctionaryUseCasesImpl implements FunctionaryUseCases {
  static instance: FunctionaryUseCasesImpl

  static getInstance = (): FunctionaryUseCasesImpl => {
    if (!FunctionaryUseCasesImpl.instance) {
      FunctionaryUseCasesImpl.instance = new FunctionaryUseCasesImpl()
    }

    return FunctionaryUseCasesImpl.instance
  }

  private functionaryRepository: FunctionaryRepository =
    FunctionaryRepositoryImpl.getInstance()

  create = async (data: IFunctionary) =>
    await this.functionaryRepository.create(data)

  getAll = async (limit: number, offset: number) =>
    await this.functionaryRepository.getAll(limit, offset)

  getByFilters = async (filters: IFunctionaryFilters, limit = 5, offset = 0) =>
    await this.functionaryRepository.getByFilters(filters, limit, offset)

  update = async (id: number, data: Partial<FunctionaryModel>) =>
    await this.functionaryRepository.update({
      ...data,
      id,
    })

  bulkUpdate = async (functionaries: Partial<IFunctionary>[]) =>
    await this.functionaryRepository.bulkUpdate(functionaries)
}
