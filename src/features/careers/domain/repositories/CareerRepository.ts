import { CareerModel } from '../../data/models/CareerModel'
import { ICareer } from '../entities/ICareer'

export interface CareerRepository {
  getAll: () => Promise<CareerModel[]>

  update: (data: Partial<ICareer>) => Promise<CareerModel>

  create: (data: ICareer) => Promise<CareerModel>
}
