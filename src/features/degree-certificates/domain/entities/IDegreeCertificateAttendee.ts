import { IFunctionary } from '../../../functionaries/domain/entities/IFunctionary'

export enum DEGREE_ATTENDANCE_ROLES {
  PRINCIPAL = 'M_PRINCIPAL',
  SUBSTITUTE = 'M_SUPLENTE',
  PRESIDENT = 'PRESIDENTE',
  MENTOR = 'TUTOR',
}

enum DEEGRE_ATTENDANCE_ROLES_LABELS {
  PRINCIPAL = 'Miembro principal',
  SUBSTITUTE = 'Miembro suplente',
  PRESIDENT = 'Presidente',
  MENTOR = 'Tutor',
}

export const DEGREE_ATTENDANCE_ROLES_OPTIONS = [
  {
    value: DEGREE_ATTENDANCE_ROLES.PRINCIPAL,
    label: DEEGRE_ATTENDANCE_ROLES_LABELS.PRINCIPAL,
  },
  {
    value: DEGREE_ATTENDANCE_ROLES.SUBSTITUTE,
    label: DEEGRE_ATTENDANCE_ROLES_LABELS.SUBSTITUTE,
  },
  {
    value: DEGREE_ATTENDANCE_ROLES.PRESIDENT,
    label: DEEGRE_ATTENDANCE_ROLES_LABELS.PRESIDENT,
  },
  {
    value: DEGREE_ATTENDANCE_ROLES.MENTOR,
    label: DEEGRE_ATTENDANCE_ROLES_LABELS.MENTOR,
  },
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

const rolePriority = [
  DEEGRE_ATTENDANCE_ROLES_LABELS.PRESIDENT,
  DEEGRE_ATTENDANCE_ROLES_LABELS.PRINCIPAL,
  DEEGRE_ATTENDANCE_ROLES_LABELS.SUBSTITUTE,
  DEEGRE_ATTENDANCE_ROLES_LABELS.MENTOR,
]

export const sortMembersByRole = (members: IDegreeCertificatesAttendee[]) =>
  members.sort((a, b) => {
    const roleALabel = DEGREE_ATTENDANCE_ROLES_OPTIONS.find(
      (role) => role.value === a.role,
    )?.label

    const roleBLabel = DEGREE_ATTENDANCE_ROLES_OPTIONS.find(
      (role) => role.value === b.role,
    )?.label

    const roleA = roleALabel
      ? rolePriority.indexOf(roleALabel)
      : rolePriority.length
    const roleB = roleBLabel
      ? rolePriority.indexOf(roleBLabel)
      : rolePriority.length

    return roleA - roleB
  })
