import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { ICreateStudent } from '../../domain/entities/ICreateStudent'
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

  getAll = async () => await this.datasource.getAll()

  update = async (data: Partial<StudentModel>) =>
    await this.datasource.update(data)

  create = async (data: ICreateStudent) => {
    try {
      const result = await this.datasource.create(data)
      const { status } = result

      if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
        return { status, student: {} as StudentModel }
      }

      return { status, student: result.student }
    } catch (error) {
      return { status: 500, student: {} as StudentModel }
    }
  }
}
