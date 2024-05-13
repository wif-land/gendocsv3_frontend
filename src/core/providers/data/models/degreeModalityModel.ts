import { IDegreeModality } from '../../domain/entities/ICertificateProvider'

export class DegreeModalityModel implements IDegreeModality {
  id: number
  code: string
  name: string
  isActive: boolean

  constructor(degreeModality: IDegreeModality) {
    this.id = degreeModality.id
    this.code = degreeModality.code
    this.name = degreeModality.name
    this.isActive = degreeModality.isActive
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJson(json: Record<string, any> | string): DegreeModalityModel {
    if (typeof json === 'string') {
      return JSON.parse(json, DegreeModalityModel.reviver)
    } else {
      const degreeModality = new DegreeModalityModel({
        id: json.id,
        code: json.code,
        name: json.name,
        isActive: json.isActive,
      })

      return degreeModality
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static reviver(key: string, value: any): any {
    return key === '' ? new DegreeModalityModel(value) : value
  }

  toJson(): IDegreeModality {
    return {
      id: this.id,
      code: this.code,
      name: this.name,
      isActive: this.isActive,
    }
  }
}
