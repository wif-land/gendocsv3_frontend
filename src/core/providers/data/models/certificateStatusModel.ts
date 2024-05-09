import { ICertificateStatus } from '../../domain/entities/ICertificateProvider'

export class CertificateStatusModel implements ICertificateStatus {
  id: number
  maleName: string
  femaleName: string
  isActive: boolean
  code: string

  constructor(certificateStatus: ICertificateStatus) {
    this.id = certificateStatus.id
    this.maleName = certificateStatus.maleName
    this.femaleName = certificateStatus.femaleName
    this.isActive = certificateStatus.isActive
    this.code = certificateStatus.code
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJson(json: Record<string, any> | string): CertificateStatusModel {
    if (typeof json === 'string') {
      return JSON.parse(json, CertificateStatusModel.reviver)
    } else {
      const certificateStatus = new CertificateStatusModel({
        id: json.id,
        maleName: json.maleName,
        femaleName: json.femaleName,
        isActive: json.isActive,
        code: json.code,
      })

      return certificateStatus
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static reviver(key: string, value: any): any {
    return key === '' ? new CertificateStatusModel(value) : value
  }

  toJson(): ICertificateStatus {
    return {
      id: this.id,
      maleName: this.maleName,
      femaleName: this.femaleName,
      isActive: this.isActive,
      code: this.code,
    }
  }
}
