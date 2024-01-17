import { API_ROUTES } from '../../../shared/constants/appApiRoutes'
import { AxiosClient } from '../../../shared/utils/AxiosClient'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'
import { IStudent } from '../types/IStudent'

export class StudentsApi {
  static fetchStudents = async (): Promise<{
    status: number
    message?: string
    students?: IStudent[]
  }> => {
    const result = await AxiosClient.get(API_ROUTES.STUDENTS.GET_ALL)
    const { status, data } = result
    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, message: data?.message }
    }

    return { status, students: data.content as IStudent[] }
  }

  static updateStudent = async (
    id: number,
    data: Partial<IStudent>,
  ): Promise<{ status: number; student?: IStudent; message?: string }> => {
    const urlWithId = API_ROUTES.STUDENTS.UPDATE.replace(':id', id.toString())
    const result = await AxiosClient.patch(urlWithId, data, {
      id,
    })
    const { status } = result
    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, message: result.data?.message }
    }
    return { status, student: result.data?.content as IStudent }
  }

  static createStudent = async (
    body: Partial<IStudent>,
  ): Promise<{
    status: number
    student?: IStudent
    message?: string
  }> => {
    const result = await AxiosClient.post(API_ROUTES.STUDENTS.CREATE, body)
    const { status, data } = result
    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, message: data?.message }
    }
    return { status, student: data.content as IStudent }
  }

  static createManyStudents = async (
    body: Partial<IStudent>[],
  ): Promise<{
    status: number
    studentsAdded?: IStudent[]
    message?: string
  }> => {
    const transformedBody = { students: body }
    console.log(transformedBody)
    const result = await AxiosClient.post(
      API_ROUTES.STUDENTS.CREATE_MANY,
      transformedBody,
    )
    const { status, data } = result
    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, message: data?.message }
    }
    return { status, studentsAdded: data.content as IStudent[] }
  }
}
