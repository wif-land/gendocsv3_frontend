/* eslint-disable @typescript-eslint/no-explicit-any */
import { IDegree } from '../../../../core/providers/domain/entities/IDegreeProvider'
import { IFunctionary } from '../../domain/entities/IFunctionary'

export class FunctionaryModel implements IFunctionary {
  id?: number
  dni: string
  firstName: string
  secondName: string
  firstLastName: string
  secondLastName: string
  outlookEmail: string
  personalEmail: string
  phoneNumber: string
  regularPhoneNumber: string
  thirdLevelDegree: number | IDegree
  fourthLevelDegree?: number | IDegree
  isActive: boolean
  name?: string

  constructor(props: IFunctionary) {
    this.id = props.id
    this.dni = props.dni
    this.firstName = props.firstName
    this.secondName = props.secondName
    this.firstLastName = props.firstLastName
    this.secondLastName = props.secondLastName
    this.outlookEmail = props.outlookEmail
    this.personalEmail = props.personalEmail
    this.phoneNumber = props.phoneNumber
    this.regularPhoneNumber = props.regularPhoneNumber
    this.thirdLevelDegree = props.thirdLevelDegree
    this.fourthLevelDegree = props.fourthLevelDegree
    this.isActive = props.isActive
    this.name = `${this.firstName} ${this.secondName} ${this.firstLastName} ${this.secondLastName}`
  }

  static fromJson(json: Record<string, any>): FunctionaryModel {
    return new FunctionaryModel({
      id: json.id,
      dni: json.dni,
      firstName: json.firstName,
      secondName: json.secondName,
      firstLastName: json.firstLastName,
      secondLastName: json.secondLastName,
      outlookEmail: json.outlookEmail,
      personalEmail: json.personalEmail,
      phoneNumber: json.phoneNumber,
      regularPhoneNumber: json.regularPhoneNumber,
      thirdLevelDegree: json.thirdLevelDegree,
      fourthLevelDegree: json.fourthLevelDegree,
      isActive: json.isActive,
      name: `${json.firstName} ${json.secondName} ${json.firstLastName} ${json.secondLastName}`,
    })
  }

  toJson(): Record<string, unknown> {
    return {
      id: this.id,
      dni: this.dni,
      firstName: this.firstName,
      secondName: this.secondName,
      firstLastName: this.firstLastName,
      secondLastName: this.secondLastName,
      outlookEmail: this.outlookEmail,
      personalEmail: this.personalEmail,
      phoneNumber: this.phoneNumber,
      regularPhoneNumber: this.regularPhoneNumber,
      thirdLevelDegree: this.thirdLevelDegree,
      fourthLevelDegree: this.fourthLevelDegree,
      isActive: this.isActive,
    }
  }
}
