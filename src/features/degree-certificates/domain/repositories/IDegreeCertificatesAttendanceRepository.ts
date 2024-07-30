import {
  ICreateDegreeCertificatesAttendee,
  IDegreeCertificatesAttendee,
} from '../entities/IDegreeCertificateAttendee'

export interface IDegreeCertificatesAttendancesRepository {
  setAttendance(id: number, hasAttended: boolean): Promise<void>

  createAttendance(data: ICreateDegreeCertificatesAttendee): Promise<void>

  getAttendance(
    degreeCertificateId: number,
  ): Promise<IDegreeCertificatesAttendee[]>

  update(data: Partial<ICreateDegreeCertificatesAttendee>): Promise<void>

  deleteAttendance(id: number): Promise<void>
}
