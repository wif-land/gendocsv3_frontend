import { StudentModel } from '../../data/models/StudentModel'
import { StudentRepositoryImpl } from '../../data/repositories/StudentRepositoryImpl'
import { ICreateStudent } from '../entities/ICreateStudent'
import { IStudent } from '../entities/IStudent'
import { IStudentFilters } from '../entities/IStudentFilters'
import { StudentRepository } from '../repositories/StudentRepository'

interface StudentUseCases {
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

  update(id: number, data: Partial<StudentModel>): Promise<StudentModel>

  bulkUpdate(students: Partial<IStudent>[]): Promise<StudentModel[]>

  bulkCreate(students: ICreateStudent[]): Promise<StudentModel[]>
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

  getAll = async (limit: number, offset: number) =>
    await this.repository.getAll(limit, offset)

  getByFilters = async (filters: IStudentFilters, limit = 5, offset = 0) =>
    await this.repository.getByFilters(filters, limit, offset)

  create = async (data: IStudent) => await this.repository.create(data)

  update = async (id: number, data: Partial<StudentModel>) =>
    await this.repository.update({ ...data, id })

  bulkUpdate = async (students: Partial<IStudent>[]) =>
    await this.repository.bulkUpdate(students)

  bulkCreate = async (students: ICreateStudent[]) =>
    await this.repository.bulkCreate(students)
}
