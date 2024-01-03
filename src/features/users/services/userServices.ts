import { IUser } from '../../auth/types/IUser'
import { UsersApi } from '../api/users'

export class UserServices {
  static async updateUser(id: number, data: Partial<IUser>): Promise<void> {
    await UsersApi.updateUser(id.toString(), data)
  }
}
