import {
  ICertificateStatus,
  ICertificateType,
  IDegreeModality,
  IRoom,
} from '../../../../core/providers/domain/entities/ICertificateProvider'
import { IStudent } from '../../../students/domain/entities/IStudent'
import { IDegreeCertificate } from '../../domain/entities/IDegreeCertificates'

export class DegreeCertificateModel implements IDegreeCertificate {
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

  constructor(data: IDegreeCertificate) {
    this.id = data.id
    this.number = data.number
    this.auxNumber = data.auxNumber
    this.topic = data.topic
    this.presentationDate = data.presentationDate
    this.student = data.student
    this.career = data.career
    this.certificateType = data.certificateType
    this.certificateStatus = data.certificateStatus
    this.degreeModality = data.degreeModality
    this.room = data.room
    this.duration = data.duration
    this.link = data.link
    this.gradesSheetDriveId = data.gradesSheetDriveId
    this.documentDriveId = data.documentDriveId
    this.isClosed = data.isClosed
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJson(json: Record<string, any>): DegreeCertificateModel {
    return new DegreeCertificateModel({
      id: json.id,
      number: json.number,
      auxNumber: json.auxNumber,
      topic: json.topic,
      presentationDate: json.presentationDate,
      student: json.studentId,
      career: json.careerId,
      certificateType: json.certificateTypeId,
      certificateStatus: json.certificateStatusId,
      degreeModality: json.degreeModalityId,
      room: json.roomId,
      duration: json.duration,
      link: json.link,
      gradesSheetDriveId: json.gradesSheetDriveId,
      documentDriveId: json.documentDriveId,
      isClosed: json.isClosed,
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
      documentDriveId: this.documentDriveId,
      isClosed: this.isClosed,
    }
  }
}
