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

  getAll = async (limit: number, offset: number) =>
    await this.datasource.getAll(limit, offset)

  getByFilters = async (
    filters: IFunctionaryFilters,
    limit: number,
    offset: number,
  ) => await this.datasource.getByFilters(filters, limit, offset)

  update = async (data: IUpdateFunctionary) =>
    await this.datasource.update(data)

  bulkUpdate = async (data: IUpdateFunctionary[]) =>
    await this.datasource.bulkUpdate(data)

  create = async (data: ICreateFunctionary) => {
    const result = await this.datasource.create(data)
    console.log({ result }, 'result')
    return result
  }
}
