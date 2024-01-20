import { FunctionaryModel } from '../../data/models/FunctionatyModel'
import { FunctionaryRepositoryImpl } from '../../data/repositories/FunctionaryRepositoryImpl'
import { IFunctionary } from '../entities/IFunctionary'
import { FunctionaryRepository } from '../repositories/FunctionaryRepository'

interface FunctionaryUseCases {
  create(data: IFunctionary): Promise<{
    status: number
    functionary: FunctionaryModel
  }>

  getAll(): Promise<{
    status: number
    functionaries: FunctionaryModel[]
  }>

  update(
    id: number,
    data: Partial<FunctionaryModel>,
  ): Promise<{
    status: number
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

  create = async (data: IFunctionary) =>
    await this.functionaryRepository.create(data)

  getAll = async () => await this.functionaryRepository.getAll()

  update = async (id: number, data: Partial<FunctionaryModel>) =>
    await this.functionaryRepository.update({
      ...data,
      id,
    })
}
