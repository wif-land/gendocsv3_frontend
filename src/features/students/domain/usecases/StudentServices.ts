import { PaginationDTO } from '../../../../shared/utils/pagination-dto'
import { StudentModel } from '../../data/models/StudentModel'
import { StudentRepositoryImpl } from '../../data/repositories/StudentRepositoryImpl'
import { IStudent } from '../entities/IStudent'
import { IStudentFilters } from '../entities/IStudentFilters'
import { StudentRepository } from '../repositories/StudentRepository'

interface StudentUseCases {
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

  update(id: number, data: Partial<StudentModel>): Promise<StudentModel>

  bulkUpdate(
    students: Partial<IStudent>[],
    isUpdate: boolean,
    userId: number,
  ): Promise<boolean>

  getById(id: number): Promise<StudentModel>
}

export class StudentUseCasesImpl implements StudentUseCases {
  static instance: StudentUseCasesImpl

  static getInstance = (): StudentUseCasesImpl => {
    if (!StudentUseCasesImpl.instance) {
      StudentUseCasesImpl.instance = new StudentUseCasesImpl()
    }

    return StudentUseCasesImpl.instance
  }

  private repository: StudentRepository = StudentRepositoryImpl.getInstance()

  getById = async (id: number): Promise<StudentModel> =>
    await this.repository.getById(id)

  getAll = async (pagination: PaginationDTO) =>
    await this.repository.getAll(pagination)

  getByFilters = async (filters: IStudentFilters, pagination: PaginationDTO) =>
    await this.repository.getByFilters(filters, pagination)

  create = async (data: IStudent) => await this.repository.create(data)

  update = async (id: number, data: Partial<StudentModel>) =>
    await this.repository.update({ ...data, id })

  bulkUpdate = async (
    students: Partial<IStudent>[],
    isUpdate: boolean,
    userId: number,
  ) => await this.repository.bulkUpdate(students, isUpdate, userId)
}
