import { IDegreeCertificate } from '../../domain/entities/IDegreeCertificates'

export class DegreeCertificateModel implements IDegreeCertificate {
  number: number
  aux_number: number
  topic: string
  presentationDate: Date
  studentId: number
  careerId: number
  certificateTypeId: number
  certificateStatusId: number
  degreeModalityId: number
  roomId: number
  duration: number
  link: string
  gradesSheetDriveId: string
  documentDriveId: string
  isClosed: boolean

  constructor(props: IDegreeCertificate) {
    this.number = props.number
    this.aux_number = props.aux_number
    this.topic = props.topic
    this.presentationDate = props.presentationDate
    this.studentId = props.studentId
    this.careerId = props.careerId
    this.certificateTypeId = props.certificateTypeId
    this.certificateStatusId = props.certificateStatusId
    this.degreeModalityId = props.degreeModalityId
    this.roomId = props.roomId
    this.duration = props.duration
    this.link = props.link
    this.gradesSheetDriveId = props.gradesSheetDriveId
    this.documentDriveId = props.documentDriveId
    this.isClosed = props.isClosed
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJson(json: Record<string, any>): DegreeCertificateModel {
    return new DegreeCertificateModel({
      number: json.number,
      aux_number: json.aux_number,
      topic: json.topic,
      presentationDate: json.presentationDate,
      studentId: json.studentId,
      careerId: json.careerId,
      certificateTypeId: json.certificateTypeId,
      certificateStatusId: json.certificateStatusId,
      degreeModalityId: json.degreeModalityId,
      roomId: json.roomId,
      duration: json.duration,
      link: json.link,
      gradesSheetDriveId: json.gradesSheetDriveId,
      documentDriveId: json.documentDriveId,
      isClosed: json.isClosed,
    })
  }

  toJson(): Record<string, unknown> {
    return {
      number: this.number,
      aux_number: this.aux_number,
      topic: this.topic,
      presentationDate: this.presentationDate,
      studentId: this.studentId,
      careerId: this.careerId,
      certificateTypeId: this.certificateTypeId,
      certificateStatusId: this.certificateStatusId,
      degreeModalityId: this.degreeModalityId,
      roomId: this.roomId,
      duration: this.duration,
      link: this.link,
      gradesSheetDriveId: this.gradesSheetDriveId,
      documentDriveId: this.documentDriveId,
      isClosed: this.isClosed,
    }
  }
}
