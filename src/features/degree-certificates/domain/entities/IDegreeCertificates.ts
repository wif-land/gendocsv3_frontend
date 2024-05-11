import { IRoom } from '../../../../core/providers/domain/entities/ICertificateProvider'
import { IStudent } from '../../../students/domain/entities/IStudent'

export interface IDegreeCertificate {
  id?: number
  number: number
  aux_number: number
  topic: string
  presentationDate: Date
  student: IStudent
  career: number
  certificateType: number
  certificateStatus: number
  degreeModality: IDegreeModality
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

export interface ICertificateType {
  code: string
  name: string
}

export interface IDegreeModality {
  code: string
  name: string
}

export interface ICertificateStatus {
  code: string
  maleName: string
  femaleName: string
}
