import {
  ICreateDegreeCertificatesAttendee,
  IDegreeCertificatesAttendee,
} from '../entities/IDegreeCertificateAttendee'

export interface IDegreeCertificatesAttendancesRepository {
  setAttendance(id: number): Promise<void>

  createAttendance(data: ICreateDegreeCertificatesAttendee): Promise<void>

  getAttendance(
    degreeCertificateId: number,
  ): Promise<IDegreeCertificatesAttendee[]>

  update(data: Partial<IDegreeCertificatesAttendee>): Promise<void>
}
