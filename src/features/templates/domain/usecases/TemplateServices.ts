import { TemplateModel } from '../../data/models/TemplatesModel'
import { TemplatesRepositoryImpl } from '../../data/repositories/TemplatesRepositoryImpl'
import { ITemplate } from '../entities/ITemplate'
import { TemplatesRepository } from '../repositories/TemplatesRepository'

interface TemplateUseCases {
  create(template: ITemplate): Promise<{
    template: TemplateModel
  }>

  update(
    id: number,
    template: Partial<TemplateModel>,
  ): Promise<{
    template: TemplateModel
  }>

  getTemplatesByProcessId(processId: number): Promise<{
    count: number
    templates: TemplateModel[]
  }>

  getTemplatesByProcessAndField(
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

export class TemplatesUseCasesImpl implements TemplateUseCases {
  static instance: TemplatesUseCasesImpl

  static getInstance = (): TemplatesUseCasesImpl => {
    if (!TemplatesUseCasesImpl.instance) {
      TemplatesUseCasesImpl.instance = new TemplatesUseCasesImpl()
    }

    return TemplatesUseCasesImpl.instance
  }

  private templateRepository: TemplatesRepository =
    TemplatesRepositoryImpl.getInstance()

  async getTemplatesByProcessId(processId: number) {
    return await this.templateRepository.getByProcessId(processId)
  }

  async getTemplatesByProcessAndField(processId: number, field: string) {
    return await this.templateRepository.getByProcessAndField(processId, field)
  }

  create = async (template: ITemplate) =>
    await this.templateRepository.create(template)

  update = async (id: number, template: Partial<TemplateModel>) =>
    await this.templateRepository.update({
      ...template,
      id,
    })

  migrateToNewProcess = async (
    templateIds: number[],
    userId: number,
    moduleId: number,
    processValue: string | number,
  ) =>
    await this.templateRepository.migrateToNewProcess(
      templateIds,
      userId,
      moduleId,
      processValue,
    )
}
