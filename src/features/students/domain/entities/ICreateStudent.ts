import { ICareer } from '../../../careers/domain/entities/ICareer'

export interface ICreateStudent {
  dni: string
  firstName: string
  secondName: string
  firstLastName: string
  secondLastName: string
  gender: string
  birthdate: string
  canton: string
  regularPhoneNumber?: string
  cellphone?: string
  folio: string
  isActive: boolean
  registration: string
  approvedCredits: number
  career: ICareer | number
  personalEmail: string
  outlookEmail: string
  phoneNumber: string
}
