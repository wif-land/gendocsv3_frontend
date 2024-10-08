/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUser, UserRole } from '../../domain/entities/IUser'

export class UserModel implements IUser {
  id?: number
  firstName: string
  secondName: string
  firstLastName: string
  secondLastName: string
  outlookEmail: string
  googleEmail: string
  role: UserRole
  password?: string
  isActive: boolean
  accessModules: number[]
  accessCareersDegCert?: any[] | number[]

  constructor(props: IUser) {
    this.id = props.id || undefined
    this.firstName = props.firstName
    this.secondName = props.secondName
    this.firstLastName = props.firstLastName
    this.secondLastName = props.secondLastName
    this.outlookEmail = props.outlookEmail
    this.googleEmail = props.googleEmail
    this.password = props.password || undefined
    this.role = props.role
    this.isActive = props.isActive
    this.accessModules = props.accessModules
    this.accessCareersDegCert = props.accessCareersDegCert || []
  }
  static fromJson(json: Record<string, any> | string): UserModel {
    if (typeof json === 'string') {
      return JSON.parse(json, UserModel.reviver)
    } else {
      const user = new UserModel({
        id: json.id,
        firstName: json.firstName,
        secondName: json.secondName,
        firstLastName: json.firstLastName,
        secondLastName: json.secondLastName,
        outlookEmail: json.outlookEmail,
        googleEmail: json.googleEmail,
        password: json.password,
        role: json.roles,
        isActive: json.isActive,
        accessModules: json.accessModules,
        accessCareersDegCert: json.accessCareersDegCert,
      })

      return user
    }
  }
  static reviver(key: string, value: any): any {
    return key === '' ? new UserModel(value) : value
  }

  toJson(): IUser {
    return {
      id: this.id,
      firstName: this.firstName,
      secondName: this.secondName,
      firstLastName: this.firstLastName,
      secondLastName: this.secondLastName,
      outlookEmail: this.outlookEmail,
      googleEmail: this.googleEmail,
      password: this.password,
      role: this.role,
      isActive: this.isActive,
      accessModules: this.accessModules,
    }
  }
}
