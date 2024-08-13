import { PaginationDTO } from '../../../../shared/utils/pagination-dto'
import { ICreateStudent } from '../../domain/entities/ICreateStudent'
import { IStudentFilters } from '../../domain/entities/IStudentFilters'
import { StudentRepository } from '../../domain/repositories/StudentRepository'
import {
  StudentDataSource,
  StudentDataSourceImpl,
} from '../datasources/StudentDatasource'
import { StudentModel } from '../models/StudentModel'

export class StudentRepositoryImpl implements StudentRepository {
  static instance: StudentRepositoryImpl

  static getInstance = (): StudentRepositoryImpl => {
    if (!StudentRepositoryImpl.instance) {
      StudentRepositoryImpl.instance = new StudentRepositoryImpl(
        StudentDataSourceImpl.getInstance(),
      )
    }

    return StudentRepositoryImpl.instance
  }

  private constructor(private readonly datasource: StudentDataSource) {}

  getAll = async (pagination: PaginationDTO) =>
    await this.datasource.getAll(pagination)

  getByFilters = async (filters: IStudentFilters, pagination?: PaginationDTO) =>
    await this.datasource.getByFilter(filters, pagination)

  create = async (data: ICreateStudent) => await this.datasource.create(data)

  update = async (data: Partial<StudentModel>) =>
    await this.datasource.update(data)

  bulkUpdate = async (
    students: Partial<StudentModel>[],
    isUpdate: boolean,
    userId: number,
  ) => await this.datasource.bulkUpdate(students, isUpdate, userId)

  getById = async (id: number) => await this.datasource.getById(id)
}
