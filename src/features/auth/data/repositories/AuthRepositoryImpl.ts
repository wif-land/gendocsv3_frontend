import { AuthRepository } from '../../domain/repositories/AuthRepository'
import { AuthDataSourceImpl } from '../datasource/AuthDatasource'

export class AuthRepositoryImpl implements AuthRepository {
  private static instance: AuthRepositoryImpl
  private readonly dataSource: AuthDataSourceImpl

  static getInstance = (): AuthRepositoryImpl => {
    if (!AuthRepositoryImpl.instance) {
      AuthRepositoryImpl.instance = new AuthRepositoryImpl()
    }

    return AuthRepositoryImpl.instance
  }

  private constructor() {
    this.dataSource = AuthDataSourceImpl.getInstance()
  }

  login = async (email: string, password: string) => {
    const result = await this.dataSource.login(email, password)

    return result
  }

  logout = () => this.dataSource.logout()

  recoverPassword = async (email: string) => {
    const result = await this.dataSource.recoverPassword(email)

    return result
  }

  newPassword = async (email: string, password: string) => {
    const result = await this.dataSource.newPassword(email, password)

    return result
  }

  resendEmail = (email: string) => {
    const result = this.dataSource.resendEmail(email)

    return result
  }
}
