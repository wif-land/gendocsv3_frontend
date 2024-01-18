import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { CareerRepository } from '../../domain/repositories/CareerRepository'
import { ICareer } from '../../types/ICareer'
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

  create = async (data: ICareer) => {
    try {
      const result = await this.datasource.create(data)
      const { status } = result

      if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
        return { status, career: {} as CareerModel }
      }

      return { status, career: result.career as CareerModel }
    } catch (error) {
      return { status: 500, career: {} as CareerModel }
    }
  }
}
