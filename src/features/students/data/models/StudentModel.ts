/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICity } from '../../../../core/providers/domain/entities/ILocationProvider'
import { ICareer } from '../../../careers/domain/entities/ICareer'
import { IStudent } from '../../domain/entities/IStudent'

export class StudentModel implements IStudent {
  id: number
  dni: string
  firstName: string
  secondName: string
  firstLastName: string
  secondLastName: string
  gender: string
  birthdate: string
  canton: number | ICity
  regularPhoneNumber?: string | undefined
  cellphone?: string | undefined
  folio: string
  isActive: boolean
  registration: string
  approvedCredits?: number
  career: ICareer | number
  updatedAt: string
  personalEmail: string
  outlookEmail: string
  phoneNumber: string
  createdAt: string
  bachelorDegree: string
  vinculationHours?: number | undefined
  internshipHours?: number
  endStudiesDate?: string | undefined
  label?: string | undefined
  startStudiesDate: string

  constructor(props: IStudent) {
    this.id = props.id
    this.dni = props.dni
    this.firstName = props.firstName
    this.secondName = props.secondName
    this.firstLastName = props.firstLastName
    this.secondLastName = props.secondLastName
    this.gender = props.gender
    this.birthdate = props.birthdate
    this.canton = props.canton
    this.regularPhoneNumber = props.regularPhoneNumber
    this.cellphone = props.cellphone
    this.folio = props.folio
    this.isActive = props.isActive
    this.registration = props.registration
    this.approvedCredits = props.approvedCredits
    this.career = props.career
    this.updatedAt = props.updatedAt
    this.personalEmail = props.personalEmail
    this.outlookEmail = props.outlookEmail
    this.phoneNumber = props.phoneNumber
    this.createdAt = props.createdAt
    this.startStudiesDate = props.startStudiesDate
    this.bachelorDegree = props.bachelorDegree
    this.vinculationHours = props.vinculationHours
    this.internshipHours = props.internshipHours
    this.endStudiesDate = props.endStudiesDate
  }

  static fromJson(json: Record<string, any>): StudentModel {
    return new StudentModel({
      id: json.id,
      dni: json.dni,
      approvedCredits: json.approvedCredits,
      birthdate: json.birthdate,
      canton: json.canton,
      career: json.career,
      createdAt: json.createdAt,
      firstLastName: json.firstLastName,
      firstName: json.firstName,
      folio: json.folio,
      gender: json.gender,
      isActive: json.isActive,
      outlookEmail: json.outlookEmail,
      personalEmail: json.personalEmail,
      phoneNumber: json.phoneNumber,
      registration: json.registration,
      secondLastName: json.secondLastName,
      secondName: json.secondName,
      updatedAt: json.updatedAt,
      cellphone: json.cellphone,
      regularPhoneNumber: json.regularPhoneNumber,
      startStudiesDate: json.startStudiesDate,
      bachelorDegree: json.bachelorDegree,
      vinculationHours: json.vinculationHours,
      internshipHours: json.internshipHours,
      endStudiesDate: json.endStudiesDate,
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
      cellphone: this.cellphone,
    }
  }
}
