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

  getAll = async () => {
    try {
      return await this.datasource.getAll()
    } catch (error) {
      return { students: [] as StudentModel[] }
    }
  }

  update = async (data: Partial<StudentModel>) => {
    try {
      await this.datasource.update(data)
      return true
    } catch (error) {
      return false
    }
  }

  create = async (data: ICreateStudent) => {
    try {
      const result = await this.datasource.create(data)
      const { status } = result

      if (status !== HTTP_STATUS_CODES.CREATED) {
        return { student: {} as StudentModel }
      }

      return { student: result.student }
    } catch (error) {
      return { student: {} as StudentModel }
    }
  }
}
