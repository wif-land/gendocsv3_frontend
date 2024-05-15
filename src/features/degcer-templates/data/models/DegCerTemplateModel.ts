import {
  ICertificateTypeCareer,
  ICertificateTypeStatuses,
  IDegCerTemplates,
} from '../../domain/entities/IDegCerTemplates'

export class DegCerTemplateModel implements IDegCerTemplates {
  id: number
  code: string
  name: string
  driveId: string
  isActive: boolean
  certificateTypeCareers: ICertificateTypeCareer[]
  certificateTypeStatuses: ICertificateTypeStatuses[]

  constructor(data: IDegCerTemplates) {
    this.id = data.id
    this.code = data.code
    this.name = data.name
    this.driveId = data.driveId
    this.isActive = data.isActive
    this.certificateTypeCareers = data.certificateTypeCareers
    this.certificateTypeStatuses = data.certificateTypeStatuses
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJson(json: Record<string, any>) {
    return new DegCerTemplateModel({
      id: json.id,
      code: json.code,
      name: json.name,
      driveId: json.driveId,
      isActive: json.isActive,
      certificateTypeCareers: json.certificateTypeCareers,
      certificateTypeStatuses: json.certificateTypeStatuses,
    })
  }

  toJson(): Record<string, unknown> {
    return {
      id: this.id,
      code: this.code,
      name: this.name,
      driveId: this.driveId,
      isActive: this.isActive,
      certificateTypeCareers: this.certificateTypeCareers,
      certificateTypeStatuses: this.certificateTypeStatuses,
    }
  }
}
