import { IFunctionary } from '../../../functionaries/domain/entities/IFunctionary'

export enum DEGREE_ATTENDANCE_ROLES {
  PRINCIPAL = 'M_PRINCIPAL',
  SUBSTITUTE = 'M_SUPLENTE',
  PRESIDENT = 'PRESIDENTE',
  MENTOR = 'TUTOR',
}

export interface IDegreeCertificatesAttendee {
  id?: number
  hasAttended: boolean
  hasBeenNotified: boolean
  role: DEGREE_ATTENDANCE_ROLES
  details: string
  assignationDate: Date
  member: IFunctionary
}
