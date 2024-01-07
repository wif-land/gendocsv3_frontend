import { UsersApi } from '../api/users'
import { IUpdateUser } from '../types/IUserUpdate'

export class UserServices {
  static async updateUser(
    id: number,
    data: Partial<IUpdateUser>,
  ): Promise<void> {
    await UsersApi.updateUser(id, data)
  }
}
