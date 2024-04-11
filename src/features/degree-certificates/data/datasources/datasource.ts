import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { IDegreeCertificateFilters } from '../../domain/entities/IDegreeCertificateFilters'
import { IDegreeCertificate } from '../../domain/entities/IDegreeCertificates'
import { DegreeCertificateModel } from '../models/CertificateDegreeModel'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'

export interface IDegreeCertificateDatasource {
  getAll(
    limit: number,
    offset: number,
  ): Promise<{
    status: number
    data: {
      count: number
      degreeCertificates: DegreeCertificateModel[]
    }
  }>

  getByFilters(
    filters: IDegreeCertificateFilters,
    limit: number,
    offset: number,
  ): Promise<{
    status: number
    data: {
      count: number
      degreeCertificates: DegreeCertificateModel[]
    }
  }>

  update(degreeCertificate: Partial<IDegreeCertificate>): Promise<{
    status: number
    degreeCertificate: DegreeCertificateModel
  }>

  create(degreeCertificate: IDegreeCertificate): Promise<{
    status: number
    degreeCertificate: DegreeCertificateModel
  }>
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
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        data: { count: 0, degreeCertificates: [] as DegreeCertificateModel[] },
      }
    }

    const { status, data } = result

    return {
      status,
      data: data.content as {
        count: number
        degreeCertificates: DegreeCertificateModel[]
      },
    }
  }

  getByFilters = async (
    filters: IDegreeCertificateFilters,
    limit: number,
    offset: number,
  ) => {
    const result = await AxiosClient.get(
      API_ROUTES.DEGREE_CERTIFICATES.GET_BY_FILTERS,
      {
        params: { limit, offset, ...filters },
      },
    )

    if ('error' in result) {
      return {
        status:
          HTTP_STATUS_CODES.NOT_FOUND ||
          HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        data: { count: 0, degreeCertificates: [] as DegreeCertificateModel[] },
      }
    }

    const { status, data } = result

    return {
      status,
      data: data.content as {
        count: number
        degreeCertificates: DegreeCertificateModel[]
      },
    }
  }

  update = async (degreeCertificate: Partial<IDegreeCertificate>) => {
    const { number, ...body } = degreeCertificate

    const result = await AxiosClient.patch(
      API_ROUTES.FUNCTIONARIES.UPDATE(number as number),
      body,
    )

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        degreeCertificate: {} as DegreeCertificateModel,
      }
    }

    const { status, data } = result

    return { status, degreeCertificate: data.content as DegreeCertificateModel }
  }

  create = async (degreeCertificate: DegreeCertificateModel) => {
    const result = await AxiosClient.post(
      API_ROUTES.FUNCTIONARIES.CREATE,
      degreeCertificate,
    )

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        degreeCertificate: {} as DegreeCertificateModel,
      }
    }

    const { status, data } = result

    return { status, degreeCertificate: data.content as DegreeCertificateModel }
  }
}
