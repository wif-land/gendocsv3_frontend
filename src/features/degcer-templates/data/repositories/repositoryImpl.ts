import { IDegCerTemplateRepository } from '../../domain/repositories/IDegCerTemplatesRepository'
import {
  DegCerTemplatesDatasourceImpl,
  IDegCerTemplatesDatasource,
} from '../datasources/datasource'

export class DegCerTemplateRepositoryImpl implements IDegCerTemplateRepository {
  static instance: DegCerTemplateRepositoryImpl

  static getInstance = (): IDegCerTemplatesDatasource => {
    if (!DegCerTemplateRepositoryImpl.instance) {
      DegCerTemplateRepositoryImpl.instance = new DegCerTemplateRepositoryImpl(
        DegCerTemplatesDatasourceImpl.getInstance(),
      )
    }

    return DegCerTemplateRepositoryImpl.instance
  }

  private constructor(
    private readonly datasource: IDegCerTemplatesDatasource,
  ) {}

  getAll = async () => this.datasource.getAll()
}
