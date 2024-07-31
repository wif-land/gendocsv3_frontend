import { IDegree } from '../../domain/entities/IDegreeProvider'

export class DegreeModel implements IDegree {
  id?: number
  abbreviation: string
  maleTitle: string
  femaleTitle: string
  degreeLevel: string

  constructor(degree: IDegree) {
    this.id = degree.id
    this.abbreviation = degree.abbreviation
    this.maleTitle = degree.maleTitle
    this.femaleTitle = degree.femaleTitle
    this.degreeLevel = degree.degreeLevel
  }

  static fromJson(json: Record<string, any> | string): DegreeModel {
    if (typeof json === 'string') {
      return JSON.parse(json, DegreeModel.reviver)
    } else {
      const degree = new DegreeModel({
        id: json.id,
        abbreviation: json.abbreviation,
        maleTitle: json.maleTitle,
        femaleTitle: json.femaleTitle,
        degreeLevel: json.degreeLevel,
      })

      return degree
    }
  }

  static reviver(key: string, value: any): any {
    return key === '' ? new DegreeModel(value) : value
  }

  toJson(): IDegree {
    return {
      id: this.id,
      abbreviation: this.abbreviation,
      maleTitle: this.maleTitle,
      femaleTitle: this.femaleTitle,
      degreeLevel: this.degreeLevel,
    }
  }
}
