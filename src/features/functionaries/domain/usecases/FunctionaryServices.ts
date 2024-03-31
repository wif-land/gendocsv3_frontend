import { FunctionaryModel } from '../../data/models/FunctionatyModel'
import { FunctionaryRepositoryImpl } from '../../data/repositories/FunctionaryRepositoryImpl'
import { IFunctionary } from '../entities/IFunctionary'
import { FunctionaryRepository } from '../repositories/FunctionaryRepository'

interface FunctionaryUseCases {
  create(
    data: IFunctionary,
  ): Promise<{ functionary: FunctionaryModel } | boolean>

  getAll(
    limit: number,
    offset: number,
  ): Promise<{
    status: number
    data: {
      count: number
      functionaries: FunctionaryModel[]
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
      functionaries: FunctionaryModel[]
    }
  }>

  update(
    id: number,
    data: Partial<FunctionaryModel>,
  ): Promise<{
    status: number
    functionary: FunctionaryModel
  }>

  bulkUpdate(functionaries: Partial<IFunctionary>[]): Promise<{
    status: number
    functionaries: FunctionaryModel[]
  }>
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

  create = async (data: IFunctionary) => {
    try {
      return await this.functionaryRepository.create(data)
    } catch (error) {
      return false
    }
  }

  getAll = async (limit: number, offset: number) =>
    await this.functionaryRepository.getAll(limit, offset)

  getByField = async (field: string, limit = 5, offset = 0) => {
    try {
      return await this.functionaryRepository.getByField(field, limit, offset)
    } catch (error) {
      return {
        status: 500,
        data: {
          count: 0,
          functionaries: [],
        },
      }
    }
  }

  update = async (id: number, data: Partial<FunctionaryModel>) =>
    await this.functionaryRepository.update({
      ...data,
      id,
    })

  bulkUpdate = async (functionaries: Partial<IFunctionary>[]) =>
    await this.functionaryRepository.bulkUpdate(functionaries)
}
