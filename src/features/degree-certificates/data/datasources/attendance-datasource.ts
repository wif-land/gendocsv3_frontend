import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import {
  ICreateDegreeCertificatesAttendee,
  IDegreeCertificatesAttendee,
} from '../../domain/entities/IDegreeCertificateAttendee'

export class DegreeCertificateAttendanceDatasource {
  getAttendance = async (id: number) => {
    const result = await AxiosClient.get(
      API_ROUTES.DEGREE_CERTIFICATES.GET_ATTENDANCE(id),
    )

    if ('error' in result) {
      return [] as IDegreeCertificatesAttendee[]
    }

    return result.data as IDegreeCertificatesAttendee[]
  }

  createAttendance = async (data: ICreateDegreeCertificatesAttendee) => {
    const result = await AxiosClient.post(
      API_ROUTES.DEGREE_CERTIFICATES.CREATE_ATTENDANCE,
      data,
    )

    if ('error' in result) {
      return Promise.reject()
    }

    return Promise.resolve()
  }

  setAttendance = async (id: number, hasAttended: boolean) => {
    const result = await AxiosClient.patch(
      API_ROUTES.DEGREE_CERTIFICATES.UPDATE_ATTENDANCE(id),
      {
        hasAttended,
      },
    )

    if ('error' in result) {
      return Promise.reject()
    }

    return Promise.resolve()
  }

  update = async (data: Partial<IDegreeCertificatesAttendee>) => {
    const attendanceId = data.id
    delete data.id

    const result = await AxiosClient.patch(
      API_ROUTES.DEGREE_CERTIFICATES.UPDATE_ATTENDANCE(attendanceId as number),
      data,
    )

    if ('error' in result) {
      return Promise.reject()
    }

    return Promise.resolve()
  }

  deleteAttendance = async (id: number) => {
    const result = await AxiosClient.delete({
      path: API_ROUTES.DEGREE_CERTIFICATES.DELETE_ATTENDANCE(id),
    })

    if ('error' in result) {
      return Promise.reject()
    }

    return Promise.resolve()
  }
}
