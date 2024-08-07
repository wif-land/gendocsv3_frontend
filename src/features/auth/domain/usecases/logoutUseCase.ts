import { UseCase } from '../../../../core/usecases/use-case'
import { AuthRepositoryImpl } from '../../data/repositories/AuthRepositoryImpl'
import { IUser } from '../entities/IUser'
import { AuthRepository } from '../repositories/AuthRepository'

export class LogoutUseCase extends UseCase<
  {
    status: number
    message?: string
    decoded?: IUser
  },
  null
> {
  private readonly repository: AuthRepository

  constructor() {
    super()
    this.repository = AuthRepositoryImpl.getInstance()
  }

  async call() {
    const result = await this.repository.logout()

    window.location.href = '/login'
    return result
  }
}
