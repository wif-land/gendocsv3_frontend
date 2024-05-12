import { ICreateCareer, IUpdateCareer } from '../../domain/entities/ICareer'
import { CareerRepository } from '../../domain/repositories/CareerRepository'
import {
  CareerDataSource,
  CareersDataSourceImpl,
} from '../datasources/CareerDatasource'

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

  update = async (data: IUpdateCareer) => await this.datasource.update(data)

  create = async (data: ICreateCareer) => await this.datasource.create(data)
}
