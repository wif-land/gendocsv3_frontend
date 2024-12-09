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

  getByProcessId = async (processId: number) =>
    await this.datasource.getByProcessId(processId)

  getByProcessAndField = async (processId: number, field: string) =>
    await this.datasource.getByProcessAndField(processId, field)

  update = async (data: Partial<TemplateModel>) =>
    await this.datasource.update(data)

  create = async (templateData: ITemplate) =>
    await this.datasource.create(templateData)

  migrateToNewProcess = async (
    templateIds: number[],
    userId: number,
    moduleId: number,
    processValue: string | number,
  ) =>
    await this.datasource.migrateToNewProcess(
      templateIds,
      userId,
      moduleId,
      processValue,
    )
}
