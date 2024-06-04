import { ICertificateType } from '../../../../core/providers/domain/entities/ICertificateProvider'
import { IDegCerGrades } from '../../domain/entities/IDegCerGrades'

export class DegCerGradesModel implements IDegCerGrades {
  id?: number
  cell: string
  gradeVariable: string
  gradeTextVariable: string
  certificateType: ICertificateType | number

  constructor(data: IDegCerGrades) {
    this.id = data.id
    this.cell = data.cell
    this.gradeVariable = data.gradeVariable
    this.gradeTextVariable = data.gradeTextVariable || ''
    this.certificateType = data.certificateType || 0
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJson(json: Record<string, any>) {
    return new DegCerGradesModel({
      id: json.id,
      cell: json.cell,
      gradeVariable: json.gradeVariable,
      gradeTextVariable: json.gradeTextVariable,
      certificateType: json.certificateType,
    })
  }

  toJson(): Record<string, unknown> {
    return {
      id: this.id,
      cell: this.cell,
      gradeVariable: this.gradeVariable,
      gradeTextVariable: this.gradeTextVariable,
      certificateType: this.certificateType,
    }
  }
}
