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

export interface ICreateFunctionary extends Omit<IFunctionary, 'id'> {
  thirdLevelDegree: number
  fourthLevelDegree: number
}

export interface IUpdateFunctionary extends Partial<IFunctionary> {}

export interface IFunctionaryFormValues extends Omit<IFunctionary, 'id'> {
  thirdLevelDegree: number
  fourthLevelDegree: number
}
