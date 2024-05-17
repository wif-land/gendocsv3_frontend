import { IDegCerTemplateRepository } from '../../domain/repositories/IDegCerTemplatesRepository'
import {
  DegCerTemplatesDatasourceImpl,
  IDegCerTemplatesDatasource,
} from '../datasources/datasource'
import { DegCerGradesModel } from '../models/DegCerGradesModel'

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

  getCellGrades = async (certificateTypeId: number) =>
    this.datasource.getCellGrades(certificateTypeId)

  createCellGrade = async (
    certificateTypeId: number,
    grade: Partial<DegCerGradesModel>,
  ) => this.datasource.createCellGrade(certificateTypeId, grade)

  deleteCellGrade = async (gradeId: number) =>
    this.datasource.deleteCellGrade(gradeId)
}
