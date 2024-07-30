import { UseCase } from '../../../../core/usecases/use-case'
import { AuthRepositoryImpl } from '../../data/repositories/AuthRepositoryImpl'
import { AuthRepository } from '../repositories/AuthRepository'

export class ResendEmailUseCase extends UseCase<
  boolean,
  {
    email: string
  }
> {
  private readonly repository: AuthRepository

  constructor() {
    super()
    this.repository = AuthRepositoryImpl.getInstance()
  }

  call(params: { email: string }) {
    return this.repository.resendEmail(params.email)
  }
}
