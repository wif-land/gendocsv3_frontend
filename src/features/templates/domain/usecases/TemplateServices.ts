import { TemplateModel } from '../../data/models/TemplatesModel'
import { TemplatesRepositoryImpl } from '../../data/repositories/TemplatesRepositoryImpl'
import { ITemplate } from '../entities/ITemplate'
import { TemplatesRepository } from '../repositories/TemplatesRepository'

interface TemplateUseCases {
  create(template: ITemplate): Promise<{
    status: number
    template: TemplateModel
  }>

  update(
    id: number,
    template: Partial<TemplateModel>,
  ): Promise<{
    status: number
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

  async getTemplatesByProcessId(
    processId: number,
  ): Promise<{ count: number; templates: TemplateModel[] }> {
    const result = await this.templateRepository.getByProcessId(processId)

    return result.data as {
      count: number
      templates: TemplateModel[]
    }
  }

  async getTemplatesByProcessAndField(
    processId: number,
    field: string,
  ): Promise<{ count: number; templates: TemplateModel[] }> {
    const result = await this.templateRepository.getByProcessAndField(
      processId,
      field,
    )

    return result.data as {
      count: number
      templates: TemplateModel[]
    }
  }

  create = async (template: ITemplate) =>
    await this.templateRepository.create(template)

  update = async (id: number, template: Partial<TemplateModel>) =>
    await this.templateRepository.update({
      ...template,
      id,
    })
}
