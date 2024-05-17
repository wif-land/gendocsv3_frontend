import { IDegree } from '../../../../core/providers/domain/entities/IDegreeProvider'

export interface IFunctionary {
  id?: number
  dni: string
  firstName: string
  secondName: string
  firstLastName: string
  secondLastName: string
  outlookEmail: string
  personalEmail: string
  phoneNumber: string
  regularPhoneNumber: string
  thirdLevelDegree: number | IDegree
  fourthLevelDegree?: number | IDegree
  isActive: boolean
  name?: string
}
