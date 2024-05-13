import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { DegreeCertificateModel } from '../models/DegreeCertificateModel'

export interface IDegCerTemplatesDatasource {
  getAllByCareerId(
    careerId: number,
    limit: number,
    offset: number,
  ): Promise<{
    count: number
    degreeCertificates: DegreeCertificateModel[]
  }>
}

export class DegreeCertificateDatasourceImpl
  implements IDegCerTemplatesDatasource
{
  static instance: DegreeCertificateDatasourceImpl

  static getInstance = (): DegreeCertificateDatasourceImpl => {
    if (!DegreeCertificateDatasourceImpl.instance) {
      DegreeCertificateDatasourceImpl.instance =
        new DegreeCertificateDatasourceImpl()
    }

    return DegreeCertificateDatasourceImpl.instance
  }

  getAllByCareerId = async (limit: number, offset: number) => {
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
}
