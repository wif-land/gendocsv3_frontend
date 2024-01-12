import { TemplateModel } from '../../data/models/TemplatesModel'
import { ITemplate } from '../entities/ITemplate'

export interface TemplatesRepository {
  update: (data: Partial<ITemplate>) => Promise<{
    status: number
  }>

  create: (templateData: ITemplate) => Promise<{
    status: number
    template: TemplateModel
  }>
}
