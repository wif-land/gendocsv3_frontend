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

  getAll = async (limit: number, offset: number) =>
    await this.datasource.getAll(limit, offset)

  getByFilters = async (
    filters: IStudentFilters,
    limit: number,
    offset: number,
  ) => await this.datasource.getByFilter(filters, limit, offset)

  create = async (data: ICreateStudent) => await this.datasource.create(data)

  update = async (data: Partial<StudentModel>) =>
    await this.datasource.update(data)

  bulkUpdate = async (students: Partial<StudentModel>[]) =>
    await this.datasource.bulkUpdate(students)

  bulkCreate = async (students: ICreateStudent[]) =>
    await this.datasource.bulkCreate(students)
}
