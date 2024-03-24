import { PaginationParams } from '../../../../shared/utils/PaginationUtil'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { ITemplate } from '../../domain/entities/ITemplate'
import { TemplatesRepository } from '../../domain/repositories/TemplatesRepository'
import {
  TemplatesDataSource,
  TemplatesDataSourceImpl,
} from '../datasource/TemplatesDatasource'
import { TemplateModel } from '../models/TemplatesModel'

export class TemplatesRepositoryImpl implements TemplatesRepository {
  static instance: TemplatesRepositoryImpl

  static getInstance = (): TemplatesRepositoryImpl => {
    if (!TemplatesRepositoryImpl.instance) {
      TemplatesRepositoryImpl.instance = new TemplatesRepositoryImpl(
        TemplatesDataSourceImpl.getInstance(),
      )
    }

    return TemplatesRepositoryImpl.instance
  }

  private constructor(private readonly datasource: TemplatesDataSource) {}

  getByProcessId = (processId: number, params: PaginationParams) =>
    this.datasource.getByProcessId(processId, params)

  update = async (data: Partial<TemplateModel>) =>
    await this.datasource.update(data)

  create = async (templateData: ITemplate) => {
    try {
      const result = await this.datasource.create(templateData)
      const { status } = result

      if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
        return { status, template: {} as TemplateModel }
      }

      return { status, template: result.template }
    } catch (error) {
      return { status: 500, template: {} as TemplateModel }
    }
  }
}
