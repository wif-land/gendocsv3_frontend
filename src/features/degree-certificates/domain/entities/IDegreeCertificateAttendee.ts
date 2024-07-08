import { IFunctionary } from '../../../functionaries/domain/entities/IFunctionary'

export enum DEGREE_ATTENDANCE_ROLES {
  PRINCIPAL = 'M_PRINCIPAL',
  SUBSTITUTE = 'M_SUPLENTE',
  PRESIDENT = 'PRESIDENTE',
  MENTOR = 'TUTOR',
}

export const DEGREE_ATTENDANCE_ROLES_OPTIONS = [
  { value: DEGREE_ATTENDANCE_ROLES.PRINCIPAL, label: 'Miembro principal' },
  { value: DEGREE_ATTENDANCE_ROLES.SUBSTITUTE, label: 'Miembro suplente' },
  { value: DEGREE_ATTENDANCE_ROLES.PRESIDENT, label: 'Presidente' },
  { value: DEGREE_ATTENDANCE_ROLES.MENTOR, label: 'Tutor' },
]

export const ROL_PRIORIDAD: { [key: string]: number } = {
  Tutor: 1,
  Presidente: 2,
  'Miembro principal': 3,
  'Miembro suplente': 4,
}

export interface IDegreeCertificatesAttendee {
  hasAttended: boolean
  hasBeenNotified: boolean
  role: DEGREE_ATTENDANCE_ROLES
  details?: string
  assignationDate: Date
  functionary: IFunctionary
  id?: number
  degreeCertificateId?: number
  createdAt?: Date
}

export interface ICreateDegreeCertificatesAttendee
  extends Omit<
    IDegreeCertificatesAttendee,
    'id' | 'hasAttended' | 'hasBeenNotified' | 'functionary'
  > {
  functionaryId: number
}
