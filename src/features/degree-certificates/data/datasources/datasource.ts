import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { IDegreeCertificateFilters } from '../../domain/entities/IDegreeCertificateFilters'
import { IDegreeCertificate } from '../../domain/entities/IDegreeCertificates'
import { DegreeCertificateModel } from '../models/model'

export interface IDegreeCertificateDatasource {
  getAll(
    limit: number,
    offset: number,
  ): Promise<{
    count: number
    degreeCertificates: DegreeCertificateModel[]
  }>

  getByFilters(
    filters: IDegreeCertificateFilters,
    limit: number,
    offset: number,
  ): Promise<{
    count: number
    degreeCertificates: DegreeCertificateModel[]
  }>

  update(
    degreeCertificate: Partial<IDegreeCertificate>,
  ): Promise<DegreeCertificateModel>

  create(degreeCertificate: IDegreeCertificate): Promise<DegreeCertificateModel>
}

export class DegreeCertificateDatasourceImpl
  implements IDegreeCertificateDatasource
{
  static instance: DegreeCertificateDatasourceImpl

  static getInstance = (): DegreeCertificateDatasourceImpl => {
    if (!DegreeCertificateDatasourceImpl.instance) {
      DegreeCertificateDatasourceImpl.instance =
        new DegreeCertificateDatasourceImpl()
    }

    return DegreeCertificateDatasourceImpl.instance
  }

  getAll = async (limit: number, offset: number) => {
    const result = await AxiosClient.get(
      API_ROUTES.DEGREE_CERTIFICATES.GET_ALL,
      {
        params: { limit, offset },
      },
    )

    if ('error' in result) {
      return {
        count: 0,
        degreeCertificates: [] as DegreeCertificateModel[],
      }
    }

    return result.data as {
      count: number
      degreeCertificates: DegreeCertificateModel[]
    }
  }

  getByFilters = async (
    filters: IDegreeCertificateFilters,
    limit: number,
    offset: number,
  ) => {
    const result = await AxiosClient.get(
      API_ROUTES.DEGREE_CERTIFICATES.GET_ALL,
      {
        params: { ...filters, limit, offset },
      },
    )

    if ('error' in result) {
      return { count: 0, degreeCertificates: [] as DegreeCertificateModel[] }
    }

    return result.data as {
      count: number
      degreeCertificates: DegreeCertificateModel[]
    }
  }

  update = async (degreeCertificate: IDegreeCertificate) => {
    const { id, ...rest } = degreeCertificate
    const result = await AxiosClient.put(
      API_ROUTES.DEGREE_CERTIFICATES.UPDATE(id as number),
      rest,
    )

    if ('error' in result) {
      return {} as DegreeCertificateModel
    }

    return result.data as DegreeCertificateModel
  }

  create = async (degreeCertificate: IDegreeCertificate) => {
    const result = await AxiosClient.post(
      API_ROUTES.DEGREE_CERTIFICATES.CREATE,
      degreeCertificate,
    )

    if ('error' in result) {
      return {} as DegreeCertificateModel
    }

    return result.data as DegreeCertificateModel
  }
}
