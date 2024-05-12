import { CareerModel } from '../../data/models/CareerModel'
import { ICreateCareer, IUpdateCareer } from '../entities/ICareer'

export interface CareerRepository {
  getAll: () => Promise<CareerModel[]>

  update: (data: IUpdateCareer) => Promise<CareerModel>

  create: (data: ICreateCareer) => Promise<CareerModel>
}
