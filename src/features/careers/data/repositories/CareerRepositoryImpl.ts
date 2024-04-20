import { ICareer } from '../../domain/entities/ICareer'
import { CareerRepository } from '../../domain/repositories/CareerRepository'
import {
  CareerDataSource,
  CareersDataSourceImpl,
} from '../datasources/CareerDatasource'
import { CareerModel } from '../models/CareerModel'

export class CareerRepositoryImpl implements CareerRepository {
  static instance: CareerRepositoryImpl

  static getInstance = (): CareerRepositoryImpl => {
    if (!CareerRepositoryImpl.instance) {
      CareerRepositoryImpl.instance = new CareerRepositoryImpl(
        CareersDataSourceImpl.getInstance(),
      )
    }

    return CareerRepositoryImpl.instance
  }

  private constructor(private readonly datasource: CareerDataSource) {}

  getAll = async () => await this.datasource.getAll()

  update = async (data: Partial<CareerModel>) =>
    await this.datasource.update(data)

  create = async (data: ICareer) => await this.datasource.create(data)
}
