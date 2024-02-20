import { StudentModel } from '../../data/models/StudentModel'
import { ICreateStudent } from '../entities/ICreateStudent'
import { IStudent } from '../entities/IStudent'

export interface StudentRepository {
  getAll(
    limit: number,
    offset: number,
  ): Promise<{
    status: number
    data: {
      count: number
      students: StudentModel[]
    }
  }>

  getByField(
    field: string,
    limit: number,
    offset: number,
  ): Promise<{
    status: number
    data: {
      count: number
      students: StudentModel[]
    }
  }>

  create(data: IStudent): Promise<{
    status: number
    student: StudentModel
  }>

  update(data: Partial<StudentModel>): Promise<{
    status: number
    student: StudentModel
  }>

  bulkUpdate(students: Partial<IStudent>[]): Promise<{
    status: number
    students: StudentModel[]
  }>

  bulkCreate(students: ICreateStudent[]): Promise<{
    status: number
    students: StudentModel[]
  }>
}
