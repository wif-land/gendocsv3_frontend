import { StudentModel } from '../../data/models/StudentModel'
import { ICreateStudent } from '../entities/ICreateStudent'
import { IStudent } from '../entities/IStudent'

export interface StudentRepository {
  getAll: () => Promise<{
    status: number
    students: StudentModel[]
  }>

  update: (data: Partial<IStudent>) => Promise<{
    status: number
  }>

  create: (data: ICreateStudent) => Promise<{
    status: number
    student: StudentModel
  }>
}
