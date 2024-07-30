import { UseCase } from '../../../../core/usecases/use-case'
import { AuthRepositoryImpl } from '../../data/repositories/AuthRepositoryImpl'
import { AuthRepository } from '../repositories/AuthRepository'

export class NewPasswordUseCase extends UseCase<
  boolean,
  {
    email: string
    password: string
  }
> {
  private readonly repository: AuthRepository

  constructor() {
    super()
    this.repository = AuthRepositoryImpl.getInstance()
  }

  call(params: { email: string; password: string }) {
    return this.repository.newPassword(params.email, params.password)
  }
}
