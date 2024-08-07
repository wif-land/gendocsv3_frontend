/* eslint-disable @typescript-eslint/no-explicit-any */
import { IFunctionary } from '../../../functionaries/domain/entities/IFunctionary'
import { ICareer } from '../../domain/entities/ICareer'

export class CareerModel implements ICareer {
  credits: number
  menDegree: string
  womenDegree: string
  internshipHours: number
  vinculationHours: number
  name: string
  isActive: boolean
  id: number
  createdAt: Date
  updatedAt: Date
  coordinator: IFunctionary

  constructor(props: ICareer) {
    this.id = props.id
    this.createdAt = props.createdAt
    this.updatedAt = props.createdAt
    this.name = props.name
    this.isActive = props.isActive || false
    this.credits = props.credits
    this.menDegree = props.menDegree
    this.womenDegree = props.womenDegree
    this.internshipHours = props.internshipHours
    this.vinculationHours = props.vinculationHours
    this.coordinator = props.coordinator
  }

  static fromJson(json: Record<string, any> | string): CareerModel {
    if (typeof json === 'string') {
      return JSON.parse(json, CareerModel.reviver)
    } else {
      const career = new CareerModel({
        id: json.id,
        createdAt: json.createdAt,
        updatedAt: json.updatedAt,
        name: json.name,
        isActive: json.isActive,
        coordinator: json.coordinator,
        credits: json.credits,
        internshipHours: json.internshipHours,
        menDegree: json.menDegree,
        vinculationHours: json.vinculationHours,
        womenDegree: json.womenDegree,
      })

      return career
    }
  }

  static reviver(key: string, value: any): any {
    return key === '' ? new CareerModel(value) : value
  }

  toJson(): ICareer {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      name: this.name,
      isActive: this.isActive,
      coordinator: this.coordinator,
      credits: this.credits,
      internshipHours: this.internshipHours,
      menDegree: this.menDegree,
      vinculationHours: this.vinculationHours,
      womenDegree: this.womenDegree,
    }
  }
}
