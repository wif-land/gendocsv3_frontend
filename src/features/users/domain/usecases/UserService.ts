import { PaginationDTO } from '../../../../shared/utils/pagination-dto'
import { UserModel } from '../../data/models/UserModel'
import { UserRepositoryImpl } from '../../data/repositories/UserRepositoryImpl'
import { IUser } from '../entities/IUser'
import { IUserFilters } from '../entities/IUserFilters'
import { UserRepository } from '../repositories/UserRepository'

interface UserUseCases {
  create(data: IUser): Promise<UserModel>

  getAll(pagination?: PaginationDTO): Promise<{
    count: number
    users: UserModel[]
  }>

  getByFiters(
    filters: IUserFilters,
    pagination: PaginationDTO,
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

  getAll = async (pagination: PaginationDTO) =>
    await this.userRepository.getAll(pagination)

  getByFiters = async (filters: IUserFilters, pagination: PaginationDTO) =>
    await this.userRepository.getByFilters(filters, pagination)

  update = async (data: Partial<IUser>) =>
    await this.userRepository.update(data)
}
