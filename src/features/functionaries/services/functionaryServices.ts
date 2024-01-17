import { IUser } from '../../auth/types/IUser'
import { FunctionariesApi } from '../api/functionaries'

export class FunctionaryServices {
  static async updateFunctionary(
    id: number,
    data: Partial<IUser>,
  ): Promise<void> {
    await FunctionariesApi.updateFunctionary(id, data)
  }
}
