import { StudentModel } from '../../data/models/StudentModel'
import { ICreateStudent } from '../entities/ICreateStudent'
import { IStudent } from '../entities/IStudent'
import { IStudentFilters } from '../entities/IStudentFilters'

export interface StudentRepository {
  getAll(
    limit: number,
    offset: number,
  ): Promise<{
    count: number
    students: StudentModel[]
  }>

  getByFilters(
    filters: IStudentFilters,
    limit: number,
    offset: number,
  ): Promise<{
    count: number
    students: StudentModel[]
  }>

  create(data: IStudent): Promise<StudentModel>

  update(data: Partial<StudentModel>): Promise<StudentModel>

  bulkUpdate(students: Partial<IStudent>[]): Promise<StudentModel[]>

  bulkCreate(students: ICreateStudent[]): Promise<StudentModel[]>

  getById(id: number): Promise<StudentModel>
}
