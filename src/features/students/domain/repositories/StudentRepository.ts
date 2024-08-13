import { PaginationDTO } from '../../../../shared/utils/pagination-dto'
import { StudentModel } from '../../data/models/StudentModel'
import { IStudent } from '../entities/IStudent'
import { IStudentFilters } from '../entities/IStudentFilters'

export interface StudentRepository {
  getAll(pagination?: PaginationDTO): Promise<{
    count: number
    students: StudentModel[]
  }>

  getByFilters(
    filters: IStudentFilters,
    pagination?: PaginationDTO,
  ): Promise<{
    count: number
    students: StudentModel[]
  }>

  create(data: IStudent): Promise<StudentModel>

  update(data: Partial<StudentModel>): Promise<StudentModel>

  bulkUpdate(
    students: Partial<IStudent>[],
    isUpdate: boolean,
    userId: number,
  ): Promise<boolean>

  getById(id: number): Promise<StudentModel>
}
