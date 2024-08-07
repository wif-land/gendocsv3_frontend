/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUser } from '../../../../features/auth/domain/entities/IUser'
import {
  ICertificateStatus,
  ICertificateType,
  IDegreeModality,
  IRoom,
} from '../../../../core/providers/domain/entities/ICertificateProvider'
import { IStudent } from '../../../students/domain/entities/IStudent'
import { IDegreeCertificate } from '../../domain/entities/IDegreeCertificates'
import { IDegreeCertificatesAttendee } from '../../domain/entities/IDegreeCertificateAttendee'

export class DegreeCertificateModel implements IDegreeCertificate {
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
  members?: IDegreeCertificatesAttendee[] | undefined
  changeUniversityDate?: string | undefined
  changeUniversityName?: string | undefined
  changeUniversityResolution?: string | undefined

  constructor(degreeCertificate: IDegreeCertificate) {
    this.id = degreeCertificate.id
    this.number = degreeCertificate.number
    this.auxNumber = degreeCertificate.auxNumber
    this.topic = degreeCertificate.topic
    this.presentationDate = degreeCertificate.presentationDate
    this.student = degreeCertificate.student
    this.career = degreeCertificate.career
    this.certificateType = degreeCertificate.certificateType
    this.certificateStatus = degreeCertificate.certificateStatus
    this.degreeModality = degreeCertificate.degreeModality
    this.room = degreeCertificate.room
    this.duration = degreeCertificate.duration
    this.link = degreeCertificate.link
    this.gradesSheetDriveId = degreeCertificate.gradesSheetDriveId
    this.certificateDriveId = degreeCertificate.certificateDriveId
    this.isClosed = degreeCertificate.isClosed
    this.user = degreeCertificate.user
    this.members = degreeCertificate.members
  }

  static fromJson(json: Record<string, any>): DegreeCertificateModel {
    return new DegreeCertificateModel({
      id: json.id,
      number: json.number,
      auxNumber: json.aux_number,
      topic: json.topic,
      presentationDate: json.presentationDate,
      student: json.student,
      career: json.career,
      certificateType: json.certificateType,
      certificateStatus: json.certificateStatus,
      degreeModality: json.degreeModality,
      room: json.roomId,
      duration: json.duration,
      link: json.link,
      gradesSheetDriveId: json.gradesSheetDriveId,
      certificateDriveId: json.certificateDriveId,
      isClosed: json.isClosed,
      user: json.user,
      members: json.attendances,
    })
  }

  toJson(): Record<string, unknown> {
    return {
      id: this.id,
      number: this.number,
      aux_number: this.auxNumber,
      topic: this.topic,
      presentationDate: this.presentationDate,
      studentId: this.student,
      careerId: this.career,
      certificateTypeId: this.certificateType,
      certificateStatusId: this.certificateStatus,
      degreeModalityId: this.degreeModality,
      roomId: this.room,
      duration: this.duration,
      link: this.link,
      gradesSheetDriveId: this.gradesSheetDriveId,
      documentDriveId: this.certificateDriveId,
      isClosed: this.isClosed,
      user: this.user,
      members: this.members,
    }
  }
}
