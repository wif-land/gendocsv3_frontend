import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { CareerModel } from '../models/CareerModel'
import { ICareer } from '../../types/ICareer'

export interface CareerDataSource {
  getAll(): Promise<{
    status: number
    careers: CareerModel[]
  }>

  update(career: Partial<ICareer>): Promise<{
    status: number
  }>

  create(career: ICareer): Promise<{
    status: number
    career: CareerModel
  }>
}

export class CareersDataSourceImpl implements CareerDataSource {
  static instance: CareersDataSourceImpl

  static getInstance = (): CareersDataSourceImpl => {
    if (!CareersDataSourceImpl.instance) {
      CareersDataSourceImpl.instance = new CareersDataSourceImpl()
    }

    return CareersDataSourceImpl.instance
  }

  create = async (career: ICareer) => {
    const result = await AxiosClient.post(API_ROUTES.CAREERS.CREATE, career)

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, career: {} as CareerModel }
    }

    return { status, career: data.content as CareerModel }
  }

  getAll = async () => {
    const result = await AxiosClient.get(API_ROUTES.CAREERS.GET_ALL)

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, careers: [] as CareerModel[] }
    }

    return { status, careers: data.content as CareerModel[] }
  }

  update = async (career: Partial<ICareer>) => {
    const { id, ...rest } = career

    const result = await AxiosClient.put(API_ROUTES.CAREERS.UPDATE, rest, {
      id,
    })

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status }
    }

    return { status, council: data.content as CareerModel }
  }
}
