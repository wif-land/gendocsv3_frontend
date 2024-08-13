import { PaginationDTO } from '../../../../shared/utils/pagination-dto'
import {
  ICreateFunctionary,
  IUpdateFunctionary,
} from '../../domain/entities/IFunctionary'
import { IFunctionaryFilters } from '../../domain/entities/IFunctionaryFilters'
import { FunctionaryRepository } from '../../domain/repositories/FunctionaryRepository'
import {
  FunctionaryDataSource,
  FunctionaryDataSourceImpl,
} from '../datasources/FunctionaryDatasource'

export class FunctionaryRepositoryImpl implements FunctionaryRepository {
  static instance: FunctionaryRepositoryImpl

  static getInstance = (): FunctionaryRepositoryImpl => {
    if (!FunctionaryRepositoryImpl.instance) {
      FunctionaryRepositoryImpl.instance = new FunctionaryRepositoryImpl(
        FunctionaryDataSourceImpl.getInstance(),
      )
    }

    return FunctionaryRepositoryImpl.instance
  }

  private constructor(private readonly datasource: FunctionaryDataSource) {}

  getAll = async (pagination?: PaginationDTO) =>
    await this.datasource.getAll(pagination)

  getByFilters = async (
    filters: IFunctionaryFilters,
    pagination?: PaginationDTO,
  ) => await this.datasource.getByFilters(filters, pagination)

  update = async (data: IUpdateFunctionary) =>
    await this.datasource.update(data)

  bulkUpdate = async (data: IUpdateFunctionary[]) =>
    await this.datasource.bulkUpdate(data)

  create = async (data: ICreateFunctionary) => {
    const result = await this.datasource.create(data)
    return result
  }
}
