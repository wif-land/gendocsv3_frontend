import { IStudent} from '../types/IStudent'
import { StudentsApi } from '../api/students'

export class StudentServices {
  static async updateStudent(id: string, data: Partial<IStudent>): Promise<void> {
    await StudentsApi.updateStudent(id, data)
  }
}