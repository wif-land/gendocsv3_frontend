import { UserModel } from '../../data/models/UserModel'
import { UserRepositoryImpl } from '../../data/repositories/UserRepositoryImpl'
import { IUser } from '../entities/IUser'
import { UserRepository } from '../repositories/UserRepository'

interface UserUseCases {
  create(data: IUser): Promise<{ user: UserModel }>

  getAll(
    limit: number,
    offset: number,
  ): Promise<{
    status: number
    data: {
      count: number
      users: UserModel[]
    }
  }>

  getByField(
    field: string,
    limit: number,
    offset: number,
  ): Promise<{
    status: number
    data: {
      count: number
      users: UserModel[]
    }
  }>

  update(
    id: number,
    data: Partial<UserModel>,
  ): Promise<{
    status: number
    user: UserModel
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

  getByField = async (field: string, limit: number, offset: number) =>
    await this.userRepository.getByField(field, limit, offset)

  update = async (id: number, data: Partial<UserModel>) =>
    await this.userRepository.update({
      ...data,
      id,
    })
}
