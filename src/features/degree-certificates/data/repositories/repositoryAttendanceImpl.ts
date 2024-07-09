import {
  ICreateDegreeCertificatesAttendee,
  IDegreeCertificatesAttendee,
} from '../../domain/entities/IDegreeCertificateAttendee'
import { IDegreeCertificatesAttendancesRepository } from '../../domain/repositories/IDegreeCertificatesAttendanceRepository'
import { DegreeCertificateAttendanceDatasource } from '../datasources/attendance-datasource'

export class DegreeCertificateAttendanceRepositoryImpl
  implements IDegreeCertificatesAttendancesRepository
{
  static instance: DegreeCertificateAttendanceRepositoryImpl

  static getInstance = () => {
    if (!DegreeCertificateAttendanceRepositoryImpl.instance) {
      DegreeCertificateAttendanceRepositoryImpl.instance =
        new DegreeCertificateAttendanceRepositoryImpl(
          new DegreeCertificateAttendanceDatasource(),
        )
    }

    return DegreeCertificateAttendanceRepositoryImpl.instance
  }

  private constructor(
    private readonly datasource: DegreeCertificateAttendanceDatasource,
  ) {}

  deleteAttendance(id: number) {
    return this.datasource.deleteAttendance(id)
  }

  getAttendance = async (degreeCertificateId: number) =>
    await this.datasource.getAttendance(degreeCertificateId)

  createAttendance = async (data: ICreateDegreeCertificatesAttendee) => {
    await this.datasource.createAttendance(data)
  }

  setAttendance = async (id: number, hasAttended: boolean) =>
    await this.datasource.setAttendance(id, hasAttended)

  update = async (data: Partial<IDegreeCertificatesAttendee>) => {
    delete data.createdAt
    await this.datasource.update(data)
  }
}
