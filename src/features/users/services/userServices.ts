import { IUser } from '../../auth/types/IUser'
import { UsersApi } from '../api/users'

export class UserServices {
  static async updateUser(id: string, data: Partial<IUser>): Promise<void> {
    await UsersApi.updateUser(id, data)
  }
}
