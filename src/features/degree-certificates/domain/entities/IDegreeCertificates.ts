import { IStudent } from '../../../students/domain/entities/IStudent'
export interface IDegreeCertificate {
  id?: number
  number: number
  aux_number: number
  topic: string
  presentationDate: Date
  studentId: IStudent | number | string
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
}

export interface IDegreeCertificatesAttendee {
  hasAttended: boolean
  hasBeenNotified: boolean
  role: 'PRESIDENT' | 'SUBROGATE' | 'MEMBER'
  functionary: unknown
}

// interface certificateType {
//   code: string
//   name: string
// }

// interface degreeModality {
//   code: string
//   name: string
// }

// interface certificateStatus{
//   code: string
//   maleName: string
//   femaleName: string
// }
