import { CareerModel } from '../../data/models/CareerModel'
import { ICareer } from '../entities/ICareer'

export interface CareerRepository {
  getAll: () => Promise<{
    status: number
    careers: CareerModel[]
  }>

  update: (data: Partial<ICareer>) => Promise<{
    status: number
  }>

  create: (data: ICareer) => Promise<{
    status: number
    career: CareerModel
  }>
}
