import { IUser } from '../entities/IUser'

export interface AuthRepository {
  login: (
    email: string,
    password: string,
  ) => Promise<{
    decoded?: IUser
  }>

  logout: () => Promise<{
    status: number
    message?: string
  }>

  recoverPassword: (email: string) => Promise<boolean>

  newPassword: (email: string, password: string) => Promise<boolean>

  resendEmail: (email: string) => Promise<boolean>
}
