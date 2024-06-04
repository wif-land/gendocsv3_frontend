import { IDegree } from '../../../../core/providers/domain/entities/IDegreeProvider'
import { IMember } from '../../../default-members/domain/entities/IDefaultMembers'

export interface IFunctionary extends Omit<IMember, 'isStudent'> {
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
