import { FunctionaryModel } from '../../data/models/FunctionatyModel'
import { FunctionaryRepositoryImpl } from '../../data/repositories/FunctionaryRepositoryImpl'
import { IFunctionary } from '../entities/IFunctionary'
import { FunctionaryRepository } from '../repositories/FunctionaryRepository'

interface FunctionaryUseCases {
  create(
    data: IFunctionary,
  ): Promise<{ functionary: FunctionaryModel } | boolean>

  getAll(): Promise<
    | {
        functionaries: FunctionaryModel[]
      }
    | boolean
  >

  update(id: number, data: Partial<FunctionaryModel>): Promise<boolean>
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

  getAll = async () => await this.functionaryRepository.getAll()

  update = async (id: number, data: Partial<FunctionaryModel>) => {
    try {
      await this.functionaryRepository.update({
        ...data,
        id,
      })
      return true
    } catch (error) {
      return false
    }
  }
}
