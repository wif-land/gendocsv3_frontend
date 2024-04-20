import { UseCase } from '../../../../core/usecases/use-case'
import { AuthRepositoryImpl } from '../../data/repositories/AuthRepositoryImpl'
import { IUser } from '../entities/IUser'
import { AuthRepository } from '../repositories/AuthRepository'

interface Params {
  email: string
  password: string
}

export class LoginUseCase extends UseCase<{ decoded?: IUser }, Params> {
  private readonly repository: AuthRepository

  constructor() {
    super()
    this.repository = AuthRepositoryImpl.getInstance()
  }

  call(params: Params) {
    return this.repository.login(params.email, params.password)
  }
}
