import { StudentModel } from '../../data/models/StudentModel'
import { ICreateStudent } from '../entities/ICreateStudent'
import { IStudent } from '../entities/IStudent'

export interface StudentRepository {
  getAll: () => Promise<{
    students: StudentModel[]
  }>

  update: (data: Partial<IStudent>) => Promise<boolean>

  create: (data: ICreateStudent) => Promise<{
    student: StudentModel
  }>
}
