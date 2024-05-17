import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { DegCerTemplateModel } from '../models/DegCerTemplateModel'
import { DegCerGradesModel } from '../models/DegCerGradesModel'

export interface IDegCerTemplatesDatasource {
  getAll(): Promise<DegCerTemplateModel[]>

  getCellGrades(certificateTypeId: number): Promise<DegCerGradesModel[]>

  createCellGrade(
    certificateTypeId: number,
    grade: Partial<DegCerGradesModel>,
  ): Promise<DegCerGradesModel>

  deleteCellGrade(gradeId: number): Promise<boolean>
}

export class DegCerTemplatesDatasourceImpl
  implements IDegCerTemplatesDatasource
{
  static instance: DegCerTemplatesDatasourceImpl

  static getInstance = (): DegCerTemplatesDatasourceImpl => {
    if (!DegCerTemplatesDatasourceImpl.instance) {
      DegCerTemplatesDatasourceImpl.instance =
        new DegCerTemplatesDatasourceImpl()
    }

    return DegCerTemplatesDatasourceImpl.instance
  }

  getAll = async (): Promise<DegCerTemplateModel[]> => {
    const response = await AxiosClient.get(
      API_ROUTES.DEGREE_CERTIFICATE_TEMPLATES.GET_ALL,
    )

    if ('error' in response) {
      return [] as DegCerTemplateModel[]
    }

    return response.data as DegCerTemplateModel[]
  }

  getCellGrades = async (
    certificateTypeId: number,
  ): Promise<DegCerGradesModel[]> => {
    const response = await AxiosClient.get(
      API_ROUTES.DEGREE_CERTIFICATE_TEMPLATES.GET_CELL_GRADES(
        certificateTypeId,
      ),
    )

    if ('error' in response) {
      return [] as DegCerGradesModel[]
    }

    return response.data as DegCerGradesModel[]
  }

  createCellGrade = async (
    certificateTypeId: number,
    grade: Partial<DegCerGradesModel>,
  ): Promise<DegCerGradesModel> => {
    const response = await AxiosClient.post(
      API_ROUTES.DEGREE_CERTIFICATE_TEMPLATES.CREATE_CELL_GRADE,
      {
        certificateTypeId,
        ...grade,
      },
    )

    if ('error' in response) {
      return {} as DegCerGradesModel
    }

    return response.data as DegCerGradesModel
  }

  deleteCellGrade = async (gradeId: number): Promise<boolean> => {
    const response = await AxiosClient.delete({
      path: API_ROUTES.DEGREE_CERTIFICATE_TEMPLATES.DELETE_CELL_GRADE(gradeId),
    })

    if ('error' in response) {
      return false
    }

    return true
  }
}
