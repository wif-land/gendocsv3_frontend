import { TemplateModel } from '../models/TemplatesModel'
import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { ITemplate } from '../../domain/entities/ITemplate'
import { DefaultResponse } from '../../../documents/domain/repositories/DocumentsRepository'

export interface TemplatesDataSource {
  update(template: Partial<ITemplate>): Promise<{
    status: number
    template: TemplateModel
  }>

  create(template: ITemplate): Promise<{
    status: number
    template: TemplateModel
  }>

  getByProcessId(processId: number): Promise<DefaultResponse<TemplateModel[]>>

  getByProcessAndField(
    processId: number,
    field: string,
  ): Promise<DefaultResponse<TemplateModel[]>>
}

export class TemplatesDataSourceImpl implements TemplatesDataSource {
  static instance: TemplatesDataSourceImpl

  static getInstance = (): TemplatesDataSourceImpl => {
    if (!TemplatesDataSourceImpl.instance) {
      TemplatesDataSourceImpl.instance = new TemplatesDataSourceImpl()
    }

    return TemplatesDataSourceImpl.instance
  }

  async getByProcessId(processId: number) {
    const result = await AxiosClient.get<{
      count: number
      templates: TemplateModel[]
    }>(API_ROUTES.TEMPLATES.GET_BY_PROCESS_ID(processId))

    const { status, data } = result

    if (status !== HTTP_STATUS_CODES.OK) {
      return { status, data: { count: 0, templates: [] } }
    }

    return { status, data: data.content }
  }

  async getByProcessAndField(processId: number, field: string) {
    const result = await AxiosClient.get<{
      count: number
      templates: TemplateModel[]
    }>(API_ROUTES.TEMPLATES.GET_BY_PROCESS_AND_FIELD(processId, field))

    const { status, data } = result

    if (status !== HTTP_STATUS_CODES.OK) {
      return { status, data: { count: 0, templates: [] } }
    }

    return { status, data: data.content }
  }

  create = async (template: TemplateModel) => {
    const result = await AxiosClient.post(API_ROUTES.TEMPLATES.CREATE, template)
    const { status, data } = result

    if (
      status !== HTTP_STATUS_CODES.OK &&
      status !== HTTP_STATUS_CODES.CREATED
    ) {
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

    if (
      status === HTTP_STATUS_CODES.OK ||
      status === HTTP_STATUS_CODES.CREATED
    ) {
      return { status, template: data.content as TemplateModel }
    }

    return { status, template: {} as TemplateModel }
  }
}
