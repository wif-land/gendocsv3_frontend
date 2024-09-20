import { TemplateModel } from '../../data/models/TemplatesModel'
import { ITemplate } from '../entities/ITemplate'

export interface TemplatesRepository {
  update: (data: Partial<ITemplate>) => Promise<{
    template: TemplateModel
  }>

  create: (templateData: ITemplate) => Promise<{
    template: TemplateModel
  }>

  getByProcessId: (processId: number) => Promise<{
    count: number
    templates: TemplateModel[]
  }>

  getByProcessAndField: (
    processId: number,
    field: string,
  ) => Promise<{
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
