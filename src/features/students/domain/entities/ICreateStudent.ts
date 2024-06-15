import { ICanton } from '../../../../core/providers/domain/entities/ILocationProvider'
import { ICareer } from '../../../careers/domain/entities/ICareer'

export interface ICreateStudent {
  dni: string
  firstName: string
  secondName: string
  firstLastName: string
  secondLastName: string
  gender: string
  birthdate: string
  canton: ICanton | number
  regularPhoneNumber?: string
  cellphone?: string
  folio: string
  isActive: boolean
  registration: string
  career: ICareer | number
  personalEmail: string
  outlookEmail: string
  phoneNumber: string
  startStudiesDate: string
  endStudiesDate?: string | undefined
  bachelorDegree: string
  approvedCredits?: number
  vinculationHours?: number
  internshipHours?: number
}
