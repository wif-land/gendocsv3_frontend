import { IFunctionary } from '../../../functionaries/domain/entities/IFunctionary'

export interface ICareer {
  id?: number
  createdAt?: Date
  updatedAt?: Date
  name: string
  credits: number
  menDegree: string
  womenDegree: string
  isActive: boolean
  internshipHours: number
  vinculationHours: number
  coordinator: IFunctionary | number | string
}
