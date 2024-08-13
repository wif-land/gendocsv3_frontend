import { PaginationDTO } from '../../../../shared/utils/pagination-dto'
import { IUser } from '../../domain/entities/IUser'
import { IUserFilters } from '../../domain/entities/IUserFilters'
import { UserRepository } from '../../domain/repositories/UserRepository'
import {
  UserDataSource,
  UserDataSourceImpl,
} from '../datasources/UserDatasource'

export class UserRepositoryImpl implements UserRepository {
  static instance: UserRepositoryImpl

  static getInstance = (): UserRepositoryImpl => {
    if (!UserRepositoryImpl.instance) {
      UserRepositoryImpl.instance = new UserRepositoryImpl(
        UserDataSourceImpl.getInstance(),
      )
    }

    return UserRepositoryImpl.instance
  }

  private constructor(private readonly datasource: UserDataSource) {}

  getAll = async (pagination?: PaginationDTO) =>
    await this.datasource.getAll(pagination)

  getByFilters = async (filters: IUserFilters, pagination?: PaginationDTO) =>
    await this.datasource.getByFilters(filters, pagination)

  update = async (data: Partial<IUser>) => await this.datasource.update(data)

  create = async (data: IUser) => await this.datasource.create(data)
}
