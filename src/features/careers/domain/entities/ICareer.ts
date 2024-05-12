import { IFunctionary } from '../../../functionaries/domain/entities/IFunctionary'

export interface ICareer {
  id: number
  createdAt: Date
  updatedAt: Date
  name: string
  credits: number
  menDegree: string
  womenDegree: string
  isActive: boolean
  internshipHours: number
  coordinator: IFunctionary
  vinculationHours: number
}

export interface ICreateCareer
  extends Omit<ICareer, 'id' | 'createdAt' | 'updatedAt' | 'coordinator'> {
  coordinator: number
  id?: number
}

export interface IUpdateCareer extends Omit<Partial<ICareer>, 'coordinator'> {
  coordinator?: number
}

export interface ICareerFormValues
  extends Omit<ICareer, 'createdAt' | 'updatedAt'> {
  coordinator: { id: number; label: string } & IFunctionary
}
