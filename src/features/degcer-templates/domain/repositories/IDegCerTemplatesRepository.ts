import { DegCerTemplateModel } from '../../data/models/DegCerTemplateModel'
export interface IDegCerTemplateRepository {
  getAll(): Promise<DegCerTemplateModel[]>
}
