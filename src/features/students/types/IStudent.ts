import { ICareer } from '../../careers/interfaces/ICareer'

export interface IStudent {
  id: string
  dni: string
  firstName: string
  secondName: string
  firstLastName: string
  secondLastName: string
  gender: string
  birthdate: string
  canton: string
  personalEmail?: string
  institutionalEmail?: string
  regularPhoneNumber?: string
  cellphone?: string
  folio: string
  isActive: boolean
  registration: string
  approvedCredits: number
  career: ICareer
  updatedAt: string
  googleEmail?: string
  outlookEmail: string
  phoneNumber: string
  name: string
}

export interface ICreateStudent {
  dni: string
  firstName: string
  secondName: string
  firstLastName: string
  secondLastName: string
  gender: string
  birthDate: Date
  canton: string
  personalEmail: string
  institutionalEmail: string
  regularPhoneNumber: string
  cellphone: string
  folio: string
  isActive: boolean
}
