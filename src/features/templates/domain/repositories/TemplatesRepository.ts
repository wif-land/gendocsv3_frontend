import { DefaultResponse } from '../../../documents/domain/repositories/DocumentsRepository'
import { TemplateModel } from '../../data/models/TemplatesModel'
import { ITemplate } from '../entities/ITemplate'

export interface TemplatesRepository {
  update: (data: Partial<ITemplate>) => Promise<{
    status: number
    template: TemplateModel
  }>

  create: (templateData: ITemplate) => Promise<{
    status: number
    template: TemplateModel
  }>

  getByProcessId: (
    processId: number,
  ) => Promise<DefaultResponse<TemplateModel[]>>

  getByProcessAndField: (
    processId: number,
    field: string,
  ) => Promise<DefaultResponse<TemplateModel[]>>
}
