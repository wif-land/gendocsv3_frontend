export interface IDegreeCertificate {
  id: string
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
  attendees: IDegreeCertificatesAttendee[]
}

export interface ICreateUpdateDegreeCertificate {
  title: string
  description: string
  attendees: IDegreeCertificatesAttendee[]
}

export interface IDegreeCertificatesAttendee {
  hasAttended: boolean
  hasBeenNotified: boolean
  role: 'PRESIDENT' | 'SUBROGATE' | 'MEMBER'
  functionary: unknown
}
