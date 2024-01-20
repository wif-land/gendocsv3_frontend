import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { IFunctionary } from '../../domain/entities/IFunctionary'
import { FunctionaryRepository } from '../../domain/repositories/FunctionaryRepository'
import {
  FunctionaryDataSource,
  FunctionaryDataSourceImpl,
} from '../datasources/FunctionaryDatasource'
import { FunctionaryModel } from '../models/FunctionatyModel'

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

  getAll = async () => await this.datasource.getAll()

  update = async (data: Partial<FunctionaryModel>) =>
    await this.datasource.update(data)

  create = async (data: IFunctionary) => {
    try {
      const result = await this.datasource.create(data)
      const { status } = result

      if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
        return { status, functionary: {} as FunctionaryModel }
      }

      return { status, functionary: result.functionary }
    } catch (error) {
      return { status: 500, functionary: {} as FunctionaryModel }
    }
  }
}
