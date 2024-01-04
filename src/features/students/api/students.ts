import { API_ROUTES } from '@/shared/constants/appApiRoutes'
import { AxiosClient } from '@/shared/utils/AxiosClient'
import { HTTP_STATUS_CODES } from '@/shared/utils/app-enums'
import { IStudent } from '../types/IStudent'

export class StudentsApi {
  static fetchStudents = async (): Promise<{
    status: number
    students?: IStudent[]
  }> => {
    const result = await AxiosClient.get(API_ROUTES.STUDENTS.GET_ALL)
    const { status, data } = result
    console.log(result)
    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) return { status }

    return { status, students: data.content as IStudent[] }
  }

  static updateStudent = async (
    id: string,
    data: Partial<IStudent>,
  ): Promise<{ status: number }> => {
    const result = await AxiosClient.put(API_ROUTES.USERS.UPDATE, data, {
      id,
    })
    const { status } = result
    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) return { status }
    return { status }
  }

  static createStudent = async (
    body: Partial<IStudent>,
  ): Promise<{
    status: number
    data?: { message: string; content: unknown }
  }> => {
    const result = await AxiosClient.post(API_ROUTES.STUDENTS.CREATE, body)
    const { status, data } = result
    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) return { status, data }
    return { status, data }
  }
}
