import { StudentModel } from '../../data/models/StudentModel'
import { StudentRepositoryImpl } from '../../data/repositories/StudentRepositoryImpl'
import { ICreateStudent } from '../entities/ICreateStudent'
import { IStudent } from '../entities/IStudent'
import { StudentRepository } from '../repositories/StudentRepository'

interface StudentUseCases {
  create(data: IStudent): Promise<{ student: StudentModel } | boolean>

  getAll(): Promise<
    | {
        students: StudentModel[]
      }
    | boolean
  >

  update(id: number, data: Partial<StudentModel>): Promise<boolean>
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

  create = async (data: ICreateStudent) => {
    try {
      return await this.repository.create(data)
    } catch (error) {
      return false
    }
  }

  getAll = async () => await this.repository.getAll()

  update = async (id: number, data: Partial<StudentModel>) => {
    try {
      await this.repository.update({
        ...data,
        id,
      })
      return true
    } catch (error) {
      return false
    }
  }
}
