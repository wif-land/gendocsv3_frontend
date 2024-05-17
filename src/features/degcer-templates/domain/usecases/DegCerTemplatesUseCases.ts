import { DegCerTemplateRepositoryImpl } from '../../data/repositories/repositoryImpl'
import { DegCerTemplateModel } from '../../data/models/DegCerTemplateModel'
import { DegCerGradesModel } from '../../data/models/DegCerGradesModel'

interface DegCerTemplateUseCases {
  getAll(): Promise<DegCerTemplateModel[]>
  getCellGrades(certificateTypeId: number): Promise<DegCerGradesModel[]>
  createCellGrade(
    certificateTypeId: number,
    grade: Partial<DegCerGradesModel>,
  ): Promise<DegCerGradesModel>

  deleteCellGrade(gradeId: number): Promise<boolean>
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

  getCellGrades = async (
    certificateTypeId: number,
  ): Promise<DegCerGradesModel[]> =>
    this.repository.getCellGrades(certificateTypeId)

  createCellGrade = async (
    certificateTypeId: number,
    grade: Partial<DegCerGradesModel>,
  ): Promise<DegCerGradesModel> =>
    this.repository.createCellGrade(certificateTypeId, grade)

  deleteCellGrade = async (gradeId: number): Promise<boolean> =>
    this.repository.deleteCellGrade(gradeId)
}
