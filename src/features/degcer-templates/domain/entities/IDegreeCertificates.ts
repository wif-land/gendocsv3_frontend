import {
  IDegreeModality,
  IRoom,
} from '../../../../core/providers/domain/entities/ICertificateProvider'
import { IStudent } from '../../../students/domain/entities/IStudent'
export interface IDegreeCertificate {
  id?: number
  number: number
  aux_number: number
  topic: string
  presentationDate: Date
  student: IStudent | number | string
  career: number
  certificateType: number
  certificateStatus: number
  degreeModality: IDegreeModality | number
  room: IRoom | number
  duration: number
  link: string
  gradesSheetDriveId: string
  documentDriveId: string
  isClosed: boolean
}

export interface IDegreeCertificatesAttendee {
  hasAttended: boolean
  hasBeenNotified: boolean
  role: 'PRESIDENT' | 'SUBROGATE' | 'MEMBER'
  functionary: unknown
}

export interface certificateType {
  code: string
  name: string
}

export interface degreeModality {
  code: string
  name: string
}

export interface certificateStatus {
  code: string
  maleName: string
  femaleName: string
}
