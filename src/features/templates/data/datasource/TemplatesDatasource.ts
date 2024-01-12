import { TemplateModel } from '../models/TemplatesModel'
import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { ITemplate } from '../../domain/entities/ITemplate'

export interface TemplatesDataSource {
  update(template: Partial<ITemplate>): Promise<{
    status: number
  }>

  create(template: ITemplate): Promise<{
    status: number
    template: TemplateModel
  }>
}

export class TemplatesDataSourceImpl implements TemplatesDataSource {
  static instance: TemplatesDataSourceImpl

  static getInstance = (): TemplatesDataSourceImpl => {
    if (!TemplatesDataSourceImpl.instance) {
      TemplatesDataSourceImpl.instance = new TemplatesDataSourceImpl()
    }

    return TemplatesDataSourceImpl.instance
  }

  create = async (template: TemplateModel) => {
    const result = await AxiosClient.post(API_ROUTES.TEMPLATES.CREATE, template)

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, template: {} as TemplateModel }
    }

    return { status, template: data.content as TemplateModel }
  }

  update = async (template: Partial<ITemplate>) => {
    const { id, ...rest } = template

    const result = await AxiosClient.patch(
      API_ROUTES.TEMPLATES.UPDATE.replace(':id', id?.toString() || ''),
      rest,
    )

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status }
    }

    return { status, template: data.content as TemplateModel }
  }
}
