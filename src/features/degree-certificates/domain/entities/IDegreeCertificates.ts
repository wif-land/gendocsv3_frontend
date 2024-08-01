import { IUser } from '../../../../features/auth/domain/entities/IUser'
import {
  ICertificateStatus,
  ICertificateType,
  IDegreeModality,
  IRoom,
} from '../../../../core/providers/domain/entities/ICertificateProvider'
import { IStudent } from '../../../students/domain/entities/IStudent'
import { IDegreeCertificatesAttendee } from './IDegreeCertificateAttendee'

export interface IDegreeCertificate {
  id?: number
  number?: number
  auxNumber?: number
  topic: string
  presentationDate?: Date
  student: IStudent
  career: number
  certificateType: number | ICertificateType
  certificateStatus?: number | ICertificateStatus
  degreeModality: IDegreeModality
  room?: IRoom | number
  duration?: number
  link?: string
  gradesSheetDriveId?: string
  certificateDriveId?: string
  isClosed: boolean
  user: IUser
  members?: IDegreeCertificatesAttendee[]
  changeUniversityResolution?: string
  changeUniversityName?: string
  changeUniversityDate?: string
}

export interface ICreateDegreeCertificate
  extends Omit<
    IDegreeCertificate,
    | 'id'
    | 'user'
    | 'student'
    | 'certificateType'
    | 'certificateStatus'
    | 'room'
    | 'career'
    | 'degreeModality'
  > {
  studentId: number
  certificateTypeId: number
  certificateStatusId: number
  roomId: number
  userId: number
  careerId: number
  degreeModalityId: number
  changeUniversityResolution?: string
  changeUniversityName?: string
  changeUniversityDate?: string
}

export interface IUpdateDegreeCertificate
  extends Partial<ICreateDegreeCertificate> {
  id: number
}

export interface IDegreeCertificateFormValues extends IDegreeCertificate {
  certificateType: { label: string; id: number } & ICertificateType
  certificateStatus: { label: string; id: number } & ICertificateStatus
  room: { label: string; id: number } & IRoom
}
