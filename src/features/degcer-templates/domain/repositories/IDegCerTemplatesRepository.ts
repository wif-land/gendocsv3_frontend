import { DegCerGradesModel } from '../../data/models/DegCerGradesModel'
import { DegCerTemplateModel } from '../../data/models/DegCerTemplateModel'
export interface IDegCerTemplateRepository {
  getAll(): Promise<DegCerTemplateModel[]>
  getCellGrades(certificateTypeId: number): Promise<DegCerGradesModel[]>
  createCellGrade(
    certificateTypeId: number,
    grade: Partial<DegCerGradesModel>,
  ): Promise<DegCerGradesModel>

  deleteCellGrade(gradeId: number): Promise<boolean>
}
