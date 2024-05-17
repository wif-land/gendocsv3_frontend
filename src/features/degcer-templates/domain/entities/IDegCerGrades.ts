import { ICertificateType } from '../../../../core/providers/domain/entities/ICertificateProvider'

export interface IDegCerGrades {
  id?: number
  cell: string
  gradeVariable: string
  gradeTextVariable?: string
  certificateType?: ICertificateType | number
}
