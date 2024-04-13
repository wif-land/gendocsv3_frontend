import { ICertificateType } from "../../domain/entities/ICertificateProvider";

export class CertificateTypeModel implements ICertificateType {
  id: number
  name: string
  isActive: boolean
  code: string;

  constructor(certificateType: ICertificateType) {
    this.id = certificateType.id
    this.name = certificateType.name
    this.isActive = certificateType.isActive
    this.code = certificateType.code
  }

  static fromJson(json: Record<string, any> | string): CertificateTypeModel {
    if (typeof json === 'string') {
      return JSON.parse(json, CertificateTypeModel.reviver)
    } else {
      const certificateType = new CertificateTypeModel({
        id: json.id,
        name: json.name,
        isActive: json.isActive,
        code: json.code
      })

      return certificateType
    }
  }

  static reviver(key: string, value: any): any {
    return key === '' ? new CertificateTypeModel(value) : value
  }

  toJson(): ICertificateType {
    return {
      id: this.id,
      name: this.name,
      isActive: this.isActive,
      code: this.code
    }
  }
}