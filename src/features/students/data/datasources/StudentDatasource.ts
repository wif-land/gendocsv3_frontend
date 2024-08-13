import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { StudentModel } from '../models/StudentModel'
import { IStudent } from '../../domain/entities/IStudent'
import { ICreateStudent } from '../../domain/entities/ICreateStudent'
import { IStudentFilters } from '../../domain/entities/IStudentFilters'
import { PaginationDTO } from '../../../../shared/utils/pagination-dto'

export interface StudentDataSource {
  getAll(pagination?: PaginationDTO): Promise<{
    count: number
    students: StudentModel[]
  }>

  getByFilter(
    filter: IStudentFilters,
    pagination?: PaginationDTO,
  ): Promise<{
    count: number
    students: StudentModel[]
  }>

  update(student: Partial<IStudent>): Promise<StudentModel>

  bulkUpdate(
    students: Partial<IStudent>[],
    isUpdate: boolean,
    userId: number,
  ): Promise<boolean>

  create(student: ICreateStudent): Promise<StudentModel>

  getById(id: number): Promise<StudentModel>
}

export class StudentDataSourceImpl implements StudentDataSource {
  static instance: StudentDataSourceImpl

  static getInstance = (): StudentDataSourceImpl => {
    if (!StudentDataSourceImpl.instance) {
      StudentDataSourceImpl.instance = new StudentDataSourceImpl()
    }

    return StudentDataSourceImpl.instance
  }

  getAll = async (pagination: PaginationDTO) => {
    const result = await AxiosClient.get(API_ROUTES.STUDENTS.GET_ALL, {
      params: { ...pagination },
    })

    if ('error' in result) {
      return { count: 0, students: [] }
    }

    return result.data as { count: number; students: StudentModel[] }
  }

  getByFilter = async (
    filters: IStudentFilters,
    pagination?: PaginationDTO,
  ) => {
    const result = await AxiosClient.get(API_ROUTES.STUDENTS.GET_BY_FILTERS, {
      params: { ...pagination, ...filters },
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
      return StudentModel.fromJson({})
    }

    return result.data as StudentModel
  }

  bulkUpdate = async (
    students: Partial<IStudent>[],
    isUpdate: boolean,
    userId: number,
  ) => {
    const result = await AxiosClient.patch<{ success: boolean }>(
      API_ROUTES.STUDENTS.BULK_UPDATE(isUpdate, userId),
      students,
    )

    if ('error' in result) {
      return false
    }

    return result.data?.success
  }

  create = async (student: ICreateStudent) => {
    const result = await AxiosClient.post(API_ROUTES.STUDENTS.CREATE, student)

    if ('error' in result) {
      return StudentModel.fromJson({})
    }

    return result.data as StudentModel
  }

  getById = async (id: number) => {
    const result = await AxiosClient.get(API_ROUTES.STUDENTS.GET_BY_ID(id))

    if ('error' in result) {
      return StudentModel.fromJson({})
    }

    return result.data as StudentModel
  }
}
