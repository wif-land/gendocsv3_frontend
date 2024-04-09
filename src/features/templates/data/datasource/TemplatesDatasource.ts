import { TemplateModel } from '../models/TemplatesModel'
import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { ITemplate } from '../../domain/entities/ITemplate'
import { DefaultResponse } from '../../../../core/utils/default-response'

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

    if ('error' in result) {
      return {
        success: false,
      }
    }

    const { data } = result

    return {
      success: true,
      data: data.content as {
        count: number
        templates: TemplateModel[]
      },
    }
  }

  async getByProcessAndField(processId: number, field: string) {
    const result = await AxiosClient.get<{
      count: number
      templates: TemplateModel[]
    }>(API_ROUTES.TEMPLATES.GET_BY_PROCESS_AND_FIELD(processId, field))

    if ('error' in result) {
      return {
        success: false,
      }
    }

    const { data } = result

    return { success: true, data: data.content }
  }

  create = async (template: TemplateModel) => {
    const result = await AxiosClient.post(API_ROUTES.TEMPLATES.CREATE, template)
    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        template: {} as TemplateModel,
      }
    }

    const { status, data } = result

    return { status, template: data.content as TemplateModel }
  }

  update = async (template: Partial<ITemplate>) => {
    const { id, ...rest } = template

    const result = await AxiosClient.patch(
      API_ROUTES.TEMPLATES.UPDATE.replace(':id', id?.toString() || ''),
      rest,
    )

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        template: {} as TemplateModel,
      }
    }

    const { status, data } = result

    return { status, template: data.content as TemplateModel }
  }
}
