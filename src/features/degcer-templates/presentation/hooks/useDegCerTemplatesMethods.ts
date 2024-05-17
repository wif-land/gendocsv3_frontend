import { DegCerGradesModel } from '../../data/models/DegCerGradesModel'
import { DegCerTemplateUseCasesImpl } from '../../domain/usecases/DegCerTemplatesUseCases'

export const useDegreeCertificateMethods = () => {
  const fetchData = async () =>
    await DegCerTemplateUseCasesImpl.getInstance().getAll()

  const fetchCellGrades = async (certificateTypeId: number) =>
    await DegCerTemplateUseCasesImpl.getInstance().getCellGrades(
      certificateTypeId,
    )

  const createCellGrade = async (
    certificateTypeId: number,
    grade: Partial<DegCerGradesModel>,
  ) =>
    await DegCerTemplateUseCasesImpl.getInstance().createCellGrade(
      certificateTypeId,
      grade,
    )

  const deleteCellGrade = async (gradeId: number) =>
    await DegCerTemplateUseCasesImpl.getInstance().deleteCellGrade(gradeId)

  return {
    fetchData,
    fetchCellGrades,
    createCellGrade,
    deleteCellGrade,
  }
}
