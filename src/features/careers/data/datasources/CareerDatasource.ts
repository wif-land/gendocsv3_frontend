import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { CareerModel } from '../models/CareerModel'
import { ICareer } from '../../domain/entities/ICareer'

export interface CareerDataSource {
  getAll(): Promise<{
    status: number
    careers: CareerModel[]
  }>

  update(career: Partial<ICareer>): Promise<{
    status: number
    career: CareerModel
  }>

  create(career: ICareer): Promise<{
    status: number
    career: CareerModel
    message?: string
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

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        career: {} as CareerModel,
      }
    }

    const { status, data } = result

    return { status, career: data.content as CareerModel }
  }

  getAll = async () => {
    const result = await AxiosClient.get(API_ROUTES.CAREERS.GET_ALL)

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        careers: [] as CareerModel[],
      }
    }

    const { status, data } = result

    return { status, careers: data.content as CareerModel[] }
  }

  update = async (career: Partial<ICareer>) => {
    const { id, ...rest } = career

    const result = await AxiosClient.put(API_ROUTES.CAREERS.UPDATE, rest, {
      id,
    })

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        career: {} as CareerModel,
      }
    }

    const { status, data } = result

    return { status, career: data.content as CareerModel }
  }
}
