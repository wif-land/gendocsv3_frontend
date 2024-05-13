import {
  ICertificateStatus,
  ICertificateType,
  IDegreeModality,
  IRoom,
} from '../../../../core/providers/domain/entities/ICertificateProvider'
import { IStudent } from '../../../students/domain/entities/IStudent'

export interface IDegreeCertificate {
  id?: number
  number: number
  auxNumber: number
  topic: string
  presentationDate: Date
  student: IStudent
  career: number
  certificateType: number | ICertificateType
  certificateStatus: number | ICertificateStatus
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
