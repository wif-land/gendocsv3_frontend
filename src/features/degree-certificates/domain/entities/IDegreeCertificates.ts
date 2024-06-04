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
  certificateDriveId: string
  isClosed: boolean
}

export interface ICreateDegreeCertificate
  extends Omit<IDegreeCertificate, 'id'> {
  certificateType: number
  certificateStatus: number
  room: number
}

export interface IUpdateDegreeCertificate extends Partial<IDegreeCertificate> {
  id: number
}

export interface IDegreeCertificateFormValues extends IDegreeCertificate {
  certificateType: { label: string; id: number } & ICertificateType
  certificateStatus: { label: string; id: number } & ICertificateStatus
  room: { label: string; id: number } & IRoom
}

export interface IDegreeCertificatesAttendee {
  hasAttended: boolean
  hasBeenNotified: boolean
  role: 'PRESIDENT' | 'SUBROGATE' | 'MEMBER'
  functionary: unknown
}
