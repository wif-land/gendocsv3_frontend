import { ACCESS_TOKEN_COOKIE_NAME } from '../../../../shared/constants/appApiRoutes'
import { UseCase } from '../../../../core/usecases/use-case'
import { AuthRepositoryImpl } from '../../data/repositories/AuthRepositoryImpl'
import { IUser } from '../entities/IUser'
import { AuthRepository } from '../repositories/AuthRepository'
import { removeCookie } from '../../../../shared/utils/CookiesUtil'

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

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async call() {
    await this.delay(500)
    const result = await this.repository.logout()
    await removeCookie(ACCESS_TOKEN_COOKIE_NAME)
    window.location.href = '/login'
    return result
  }
}
