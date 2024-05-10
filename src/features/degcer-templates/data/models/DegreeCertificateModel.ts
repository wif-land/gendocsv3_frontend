import {
  IDegreeModality,
  IRoom,
} from '../../../../core/providers/domain/entities/ICertificateProvider'
import { IStudent } from '../../../students/domain/entities/IStudent'
import { IDegreeCertificate } from '../../domain/entities/IDegreeCertificates'

export class DegreeCertificateModel implements IDegreeCertificate {
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

  constructor(props: IDegreeCertificate) {
    this.id = props.id
    this.number = props.number
    this.aux_number = props.aux_number
    this.topic = props.topic
    this.presentationDate = props.presentationDate
    this.student = props.student
    this.career = props.career
    this.certificateType = props.certificateType
    this.certificateStatus = props.certificateStatus
    this.degreeModality = props.degreeModality
    this.room = props.room
    this.duration = props.duration
    this.link = props.link
    this.gradesSheetDriveId = props.gradesSheetDriveId
    this.documentDriveId = props.documentDriveId
    this.isClosed = props.isClosed
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJson(json: Record<string, any>): DegreeCertificateModel {
    return new DegreeCertificateModel({
      id: json.id,
      number: json.number,
      aux_number: json.aux_number,
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
      aux_number: this.aux_number,
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
