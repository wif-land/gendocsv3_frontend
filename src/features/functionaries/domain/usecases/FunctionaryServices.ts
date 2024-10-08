import { PaginationDTO } from '../../../../shared/utils/pagination-dto'
import { FunctionaryModel } from '../../data/models/FunctionatyModel'
import { FunctionaryRepositoryImpl } from '../../data/repositories/FunctionaryRepositoryImpl'
import {
  IFunctionary,
  IFunctionaryFormValues,
  IUpdateFunctionary,
} from '../entities/IFunctionary'
import { IFunctionaryFilters } from '../entities/IFunctionaryFilters'
import { FunctionaryRepository } from '../repositories/FunctionaryRepository'

interface FunctionaryUseCases {
  create(data: IFunctionary): Promise<FunctionaryModel>

  getAll(pagination?: PaginationDTO): Promise<{
    count: number
    functionaries: FunctionaryModel[]
  }>

  getByFilters(
    filters: IFunctionaryFilters,
    pagination?: PaginationDTO,
  ): Promise<{
    count: number
    functionaries: FunctionaryModel[]
  }>

  update(
    id: number,
    data: Partial<IFunctionaryFormValues>,
  ): Promise<FunctionaryModel>

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

  create = async (data: IFunctionaryFormValues) =>
    await this.functionaryRepository.create({
      ...data,
      fourthLevelDegree: data.fourthLevelDegree,
      thirdLevelDegree: data.thirdLevelDegree,
    })

  getAll = async (pagination: PaginationDTO) =>
    await this.functionaryRepository.getAll(pagination)

  getByFilters = async (
    filters: IFunctionaryFilters,
    pagination: PaginationDTO,
  ) => await this.functionaryRepository.getByFilters(filters, pagination)

  update = async (id: number, data: Partial<IFunctionaryFormValues>) => {
    const extraData: Record<string, number> = {}

    const fourthLevelDegree = data.fourthLevelDegree
    const thirdLevelDegree = data.thirdLevelDegree

    if (fourthLevelDegree) {
      extraData['fourthLevelDegree'] = fourthLevelDegree
    }

    if (thirdLevelDegree) {
      extraData['thirdLevelDegree'] = thirdLevelDegree
    }

    return await this.functionaryRepository.update({
      ...data,
      ...extraData,
      id,
    })
  }

  bulkUpdate = async (functionaries: IUpdateFunctionary[]) =>
    await this.functionaryRepository.bulkUpdate(functionaries)
}
