import { UserModel } from '../../data/models/UserModel'
import { UserRepositoryImpl } from '../../data/repositories/UserRepositoryImpl'
import { IUser } from '../entities/IUser'
import { IUserFilters } from '../entities/IUserFilters'
import { UserRepository } from '../repositories/UserRepository'

interface UserUseCases {
  create(data: IUser): Promise<UserModel>

  getAll(
    limit: number,
    offset: number,
  ): Promise<{
    count: number
    users: UserModel[]
  }>

  getByFiters(
    limit: number,
    offset: number,
    filters: IUserFilters,
  ): Promise<{
    count: number
    users: UserModel[]
  }>

  update(data: Partial<IUser>): Promise<{
    user: UserModel
    accessToken: string
  }>
}

export class UserUseCasesImpl implements UserUseCases {
  static instance: UserUseCasesImpl

  static getInstance = (): UserUseCasesImpl => {
    if (!UserUseCasesImpl.instance) {
      UserUseCasesImpl.instance = new UserUseCasesImpl()
    }

    return UserUseCasesImpl.instance
  }

  private userRepository: UserRepository = UserRepositoryImpl.getInstance()

  create = async (data: IUser) => await this.userRepository.create(data)

  getAll = async (limit: number, offset: number) =>
    await this.userRepository.getAll(limit, offset)

  getByFiters = async (limit: number, offset: number, filters: IUserFilters) =>
    await this.userRepository.getByFilters(limit, offset, filters)

  update = async (data: Partial<IUser>) =>
    await this.userRepository.update(data)
}
