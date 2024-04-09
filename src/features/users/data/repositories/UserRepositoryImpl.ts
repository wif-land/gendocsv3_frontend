import { IUser } from '../../domain/entities/IUser'
import { IUserFilters } from '../../domain/entities/IUserFilters'
import { UserRepository } from '../../domain/repositories/UserRepository'
import {
  UserDataSource,
  UserDataSourceImpl,
} from '../datasources/UserDatasource'
import { UserModel } from '../models/UserModel'

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

  getAll = async (limit: number, offset: number) =>
    await this.datasource.getAll(limit, offset)

  getByFilters = async (limit: number, offset: number, filters: IUserFilters) =>
    await this.datasource.getByFilters(limit, offset, filters)

  update = async (data: Partial<UserModel>) =>
    await this.datasource.update(data)

  create = async (data: IUser) => await this.datasource.create(data)
}
