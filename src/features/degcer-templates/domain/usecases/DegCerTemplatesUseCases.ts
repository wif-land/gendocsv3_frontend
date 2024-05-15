import { DegCerTemplateRepositoryImpl } from '../../data/repositories/repositoryImpl'
import { DegCerTemplateModel } from '../../data/models/DegCerTemplateModel'

interface DegCerTemplateUseCases {
  getAll(): Promise<DegCerTemplateModel[]>
}

export class DegCerTemplateUseCasesImpl implements DegCerTemplateUseCases {
  static instance: DegCerTemplateUseCases

  static getInstance = (): DegCerTemplateUseCases => {
    if (!DegCerTemplateUseCasesImpl.instance) {
      DegCerTemplateUseCasesImpl.instance = new DegCerTemplateUseCasesImpl(
        DegCerTemplateRepositoryImpl.getInstance(),
      )
    }

    return DegCerTemplateUseCasesImpl.instance
  }

  constructor(private readonly repository: DegCerTemplateUseCases) {}

  getAll = async (): Promise<DegCerTemplateModel[]> => this.repository.getAll()
}
