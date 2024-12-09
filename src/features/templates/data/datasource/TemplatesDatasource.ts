import { TemplateModel } from '../models/TemplatesModel'
import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { ITemplate } from '../../domain/entities/ITemplate'

export interface TemplatesDataSource {
  update(template: Partial<ITemplate>): Promise<{
    template: TemplateModel
  }>

  create(template: ITemplate): Promise<{
    template: TemplateModel
  }>

  getByProcessId(processId: number): Promise<{
    count: number
    templates: TemplateModel[]
  }>

  getByProcessAndField(
    processId: number,
    field: string,
  ): Promise<{
    count: number
    templates: TemplateModel[]
  }>

  migrateToNewProcess: (
    templateIds: number[],
    userId: number,
    moduleId: number,
    processValue: string | number,
  ) => Promise<{
    status: number
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

  async getByProcessId(processId: number) {
    const result = await AxiosClient.get(
      API_ROUTES.TEMPLATES.GET_BY_PROCESS_ID(processId),
    )

    if ('error' in result) {
      return { count: 0, templates: [] as TemplateModel[] }
    }

    return result.data as { count: number; templates: TemplateModel[] }
  }

  async getByProcessAndField(processId: number, field: string) {
    const result = await AxiosClient.get(
      API_ROUTES.TEMPLATES.GET_BY_PROCESS_AND_FIELD(processId, field),
    )

    if ('error' in result) {
      return { count: 0, templates: [] as TemplateModel[] }
    }

    return result.data as {
      count: number
      templates: TemplateModel[]
    }
  }

  create = async (template: TemplateModel) => {
    const result = await AxiosClient.post(API_ROUTES.TEMPLATES.CREATE, template)
    if ('error' in result) {
      return {
        template: {} as TemplateModel,
      }
    }

    return {
      template: result.data as TemplateModel,
    }
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

    return result.data as { template: TemplateModel }
  }

  async migrateToNewProcess(
    templateIds: number[],
    userId: number,
    moduleId: number,
    processValue: string | number,
  ) {
    const keyName =
      typeof processValue === 'string' ? 'newProcessName' : 'processId'

    const result = await AxiosClient.patch(API_ROUTES.TEMPLATES.MIGRATE, {
      templateIds,
      userId,
      moduleId,
      [keyName]: processValue,
    })

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      }
    }

    return {
      status: HTTP_STATUS_CODES.OK,
    }
  }
}
