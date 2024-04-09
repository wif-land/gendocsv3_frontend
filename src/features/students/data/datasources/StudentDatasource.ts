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
    status: number
    data: {
      count: number
      students: StudentModel[]
    }
  }>

  getByFilter(
    filter: IStudentFilters,
    limit: number,
    offset: number,
  ): Promise<{
    status: number
    data: {
      count: number
      students: StudentModel[]
    }
  }>

  update(student: Partial<IStudent>): Promise<{
    status: number
    student: StudentModel
  }>

  bulkUpdate(students: Partial<IStudent>[]): Promise<{
    status: number
    students: StudentModel[]
  }>

  create(student: ICreateStudent): Promise<{
    status: number
    student: StudentModel
  }>

  bulkCreate(students: ICreateStudent[]): Promise<{
    status: number
    students: StudentModel[]
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

  getAll = async (limit: number, offset: number) => {
    const result = await AxiosClient.get(API_ROUTES.STUDENTS.GET_ALL, {
      params: { limit, offset },
    })

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        data: { count: 0, students: [] },
      }
    }

    const { status, data } = result

    return {
      status,
      data: data.content as { count: number; students: StudentModel[] },
    }
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
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        data: { count: 0, students: [] },
      }
    }

    const { status, data } = result

    return {
      status,
      data: data.content as { count: number; students: StudentModel[] },
    }
  }

  update = async (functionary: Partial<IStudent>) => {
    const { id, ...body } = functionary

    const result = await AxiosClient.patch(
      API_ROUTES.STUDENTS.UPDATE(id as number),
      body,
    )

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        student: {} as StudentModel,
      }
    }

    const { status, data } = result

    return { status, student: data.content as StudentModel }
  }

  bulkUpdate = async (students: Partial<IStudent>[]) => {
    const result = await AxiosClient.patch(
      API_ROUTES.STUDENTS.BULK_UPDATE,
      students,
    )

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        students: [] as StudentModel[],
      }
    }

    const { status, data } = result

    return { status, students: data.content as StudentModel[] }
  }

  create = async (student: ICreateStudent) => {
    const result = await AxiosClient.post(API_ROUTES.STUDENTS.CREATE, student)

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        student: {} as StudentModel,
      }
    }

    const { status, data } = result

    return { status, student: data.content as StudentModel }
  }

  bulkCreate = async (students: ICreateStudent[]) => {
    const result = await AxiosClient.post(API_ROUTES.STUDENTS.CREATE_MANY, {
      students,
    })

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        students: [] as StudentModel[],
      }
    }

    const { status, data } = result

    return { status, students: data.content as StudentModel[] }
  }
}
