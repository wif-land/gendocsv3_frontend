import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { DegCerTemplateModel } from '../models/DegCerTemplateModel'

export interface IDegCerTemplatesDatasource {
  getAll(): Promise<DegCerTemplateModel[]>
}

export class DegCerTemplatesDatasourceImpl
  implements IDegCerTemplatesDatasource
{
  static instance: DegCerTemplatesDatasourceImpl

  static getInstance = (): DegCerTemplatesDatasourceImpl => {
    if (!DegCerTemplatesDatasourceImpl.instance) {
      DegCerTemplatesDatasourceImpl.instance =
        new DegCerTemplatesDatasourceImpl()
    }

    return DegCerTemplatesDatasourceImpl.instance
  }

  getAll = async (): Promise<DegCerTemplateModel[]> => {
    const response = await AxiosClient.get(
      API_ROUTES.DEGREE_CERTIFICATE_TEMPLATES.GET_ALL,
    )

    if ('error' in response) {
      return [] as DegCerTemplateModel[]
    }

    return response.data as DegCerTemplateModel[]
  }
}
