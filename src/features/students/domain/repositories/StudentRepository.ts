import { StudentModel } from '../../data/models/StudentModel'
import { IStudent } from '../entities/IStudent'

export interface StudentRepository {
  getAll: () => Promise<{
    status: number
    students: StudentModel[]
  }>

  update: (data: Partial<IStudent>) => Promise<{
    status: number
  }>

  create: (data: IStudent) => Promise<{
    status: number
    student: StudentModel
  }>
}
