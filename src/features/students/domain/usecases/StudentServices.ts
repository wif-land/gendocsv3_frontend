import { StudentModel } from '../../data/models/StudentModel'
import { StudentRepositoryImpl } from '../../data/repositories/StudentRepositoryImpl'
import { ICreateStudent } from '../entities/ICreateStudent'
import { IStudent } from '../entities/IStudent'
import { StudentRepository } from '../repositories/StudentRepository'

interface StudentUseCases {
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

  create(data: IStudent): Promise<{ student: StudentModel }>

  update(
    id: number,
    data: Partial<StudentModel>,
  ): Promise<{
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

  getByField = async (field: string, limit: number, offset: number) =>
    await this.repository.getByField(field, limit, offset)

  create = async (data: IStudent) => await this.repository.create(data)

  update = async (id: number, data: Partial<StudentModel>) =>
    await this.repository.update({ ...data, id })

  bulkUpdate = async (students: Partial<IStudent>[]) =>
    await this.repository.bulkUpdate(students)

  bulkCreate = async (students: ICreateStudent[]) =>
    await this.repository.bulkCreate(students)
}
