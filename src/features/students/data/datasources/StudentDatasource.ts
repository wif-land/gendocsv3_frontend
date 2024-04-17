import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { StudentModel } from '../models/StudentModel'
import { IStudent } from '../../domain/entities/IStudent'
import { ICreateStudent } from '../../domain/entities/ICreateStudent'
import { IStudentFilters } from '../../domain/entities/IStudentFilters'

export interface StudentDataSource {
  getAll(
    limit: number,
    offset: number,
  ): Promise<{
    count: number
    students: StudentModel[]
  }>

  getByFilter(
    field: IStudentFilters,
    limit: number,
    offset: number,
  ): Promise<{
    count: number
    students: StudentModel[]
  }>

  update(student: Partial<IStudent>): Promise<StudentModel>

  bulkUpdate(students: Partial<IStudent>[]): Promise<StudentModel[]>

  create(student: ICreateStudent): Promise<StudentModel>

  bulkCreate(students: ICreateStudent[]): Promise<StudentModel[]>
}

export class StudentDataSourceImpl implements StudentDataSource {
  static instance: StudentDataSourceImpl

  static getInstance = (): StudentDataSourceImpl => {
    if (!StudentDataSourceImpl.instance) {
      StudentDataSourceImpl.instance = new StudentDataSourceImpl()
    }

    return StudentDataSourceImpl.instance
  }

  getAll = async (limit: number, offset: number) => {
    const result = await AxiosClient.get(API_ROUTES.STUDENTS.GET_ALL, {
      params: { limit, offset },
    })

    if ('error' in result) {
      return { count: 0, students: [] }
    }


    return result.data as { count: number; students: StudentModel[] }
  }

  getByFilter = async (
    filters: IStudentFilters,
    limit: number,
    offset: number,
  ) => {
    const result = await AxiosClient.get(API_ROUTES.STUDENTS.GET_BY_FILTERS, {
      params: { limit, offset, ...filters },
    })

    if ('error' in result) {
      return { count: 0, students: [] }
    }

    return result.data as { count: number; students: StudentModel[] }
  }

  update = async (functionary: Partial<IStudent>) => {
    const { id, ...body } = functionary

    const result = await AxiosClient.patch(
      API_ROUTES.STUDENTS.UPDATE(id as number),
      body,
    )

    if ('error' in result) {
      return {} as StudentModel
    }

    return result.data as StudentModel
  }

  bulkUpdate = async (students: Partial<IStudent>[]) => {
    const result = await AxiosClient.patch(
      API_ROUTES.STUDENTS.BULK_UPDATE,
      students,
    )

    if ('error' in result) {
      return [] as StudentModel[]
    }

    return result.data as StudentModel[]
  }

  create = async (student: ICreateStudent) => {
    const result = await AxiosClient.post(API_ROUTES.STUDENTS.CREATE, student)

    if ('error' in result) {
      return {} as StudentModel
    }

    return result.data as StudentModel
  }

  bulkCreate = async (students: ICreateStudent[]) => {
    const result = await AxiosClient.post(API_ROUTES.STUDENTS.CREATE_MANY, {
      students,
    })

    if ('error' in result) {
      return [] as StudentModel[]
    }

    return result.data as StudentModel[]
  }
}
