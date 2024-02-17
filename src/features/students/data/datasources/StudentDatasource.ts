import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { StudentModel } from '../models/StudentModel'
import { IStudent } from '../../domain/entities/IStudent'
import { ICreateStudent } from '../../domain/entities/ICreateStudent'

export interface StudentDataSource {
  getAll(): Promise<{
    status: number
    students: StudentModel[]
  }>

  update(student: Partial<IStudent>): Promise<{
    status: number
  }>

  create(student: ICreateStudent): Promise<{
    status: number
    student: StudentModel
  }>
}

export class StudentDataSourceImpl implements StudentDataSource {
  static instance: StudentDataSourceImpl

  static getInstance = (): StudentDataSourceImpl => {
    if (!StudentDataSourceImpl.instance) {
      StudentDataSourceImpl.instance = new StudentDataSourceImpl()
    }

    return StudentDataSourceImpl.instance
  }

  create = async (student: ICreateStudent) => {
    const result = await AxiosClient.post(API_ROUTES.STUDENTS.CREATE, student)

    const { status, data } = result

    if (status !== HTTP_STATUS_CODES.CREATED) {
      return { status, student: {} as StudentModel }
    }

    return { status, student: data.content as StudentModel }
  }

  getAll = async () => {
    const result = await AxiosClient.get(API_ROUTES.STUDENTS.GET_ALL)

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, students: [] as StudentModel[] }
    }

    return { status, students: data.content as StudentModel[] }
  }

  update = async (functionary: Partial<IStudent>) => {
    const { id, ...body } = functionary

    const result = await AxiosClient.patch(
      API_ROUTES.STUDENTS.UPDATE(id as number),
      body,
    )

    const { status } = result

    if (status !== HTTP_STATUS_CODES.OK) {
      throw new Error('Error al actualizar el estudiante!')
    }

    return { status }
  }
}
