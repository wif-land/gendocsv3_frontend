import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { CareerModel } from '../models/CareerModel'
import { ICreateCareer, IUpdateCareer } from '../../domain/entities/ICareer'

export interface CareerDataSource {
  getAll(): Promise<CareerModel[]>

  update(career: IUpdateCareer): Promise<CareerModel>

  create(career: ICreateCareer): Promise<CareerModel>
}

export class CareersDataSourceImpl implements CareerDataSource {
  static instance: CareersDataSourceImpl

  static getInstance = (): CareersDataSourceImpl => {
    if (!CareersDataSourceImpl.instance) {
      CareersDataSourceImpl.instance = new CareersDataSourceImpl()
    }

    return CareersDataSourceImpl.instance
  }

  create = async (career: ICreateCareer) => {
    const result = await AxiosClient.post(API_ROUTES.CAREERS.CREATE, career)

    if ('error' in result) {
      return {} as CareerModel
    }

    return result.data as CareerModel
  }

  getAll = async () => {
    const result = await AxiosClient.get(API_ROUTES.CAREERS.GET_ALL)

    if ('error' in result) {
      return [] as CareerModel[]
    }

    return result.data as CareerModel[]
  }

  update = async (career: IUpdateCareer) => {
    const { id, ...rest } = career

    const result = await AxiosClient.put(API_ROUTES.CAREERS.UPDATE, rest, {
      id,
    })

    if ('error' in result) {
      return {} as CareerModel
    }

    return result.data as CareerModel
  }
}
