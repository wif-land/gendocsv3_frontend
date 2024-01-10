/* eslint-disable @typescript-eslint/no-explicit-any */
import { CouncilType, ICouncil } from '../../domain/entities/ICouncil'

export class CouncilModel implements ICouncil {
  id?: number
  createdAt?: Date
  updatedAt?: Date
  name: string
  isActive: boolean
  isArchived: boolean
  date: Date
  type: CouncilType

  constructor(props: ICouncil) {
    this.id = props.id || undefined
    this.createdAt = props.createdAt
    this.updatedAt = props.createdAt
    this.name = props.name
    this.isActive = props.isActive || true
    this.isArchived = props.isArchived || false
    this.date = props.date
    this.type = props.type
  }

  static fromJson(json: Record<string, any> | string): CouncilModel {
    if (typeof json === 'string') {
      return JSON.parse(json, CouncilModel.reviver)
    } else {
      const career = new CouncilModel({
        id: json.id,
        createdAt: json.createdAt,
        updatedAt: json.updatedAt,
        name: json.name,
        isActive: json.isActive,
        isArchived: json.isArchived,
        date: json.date,
        type: json.type,
      })

      return career
    }
  }

  static reviver(key: string, value: any): any {
    return key === '' ? new CouncilModel(value) : value
  }

  toJson(): ICouncil {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      name: this.name,
      date: this.date,
      isActive: this.isActive,
      isArchived: this.isArchived,
      type: this.type,
    }
  }
}
