import { UserRole } from '../../../../features/users/domain/entities/IUser'

export type IRoleType = 'ADMIN' | 'WRITER' | 'READER'

export interface IUser {
  id: number
  sub?: number
  firstName: string
  secondName: string
  firstLastName: string
  secondLastName: string
  outlookEmail: string
  googleEmail: string
  role?: UserRole | null
  isActive: boolean
  accessModules?: number[] | null
  accessCareersDegCert?: number[]
}

export interface IUserPayload {
  id: number
  sub: number
  firstName: string
  secondName: string
  firstLastName: string
  secondLastName: string
  outlookEmail: string
  googleEmail: string
  role?: UserRole | null
  isActive: boolean
  accessModules?: number[] | null
}

export interface ICreateUser {
  sub: number
  id: number
  firstName: string
  secondName: string
  firstLastName: string
  secondLastName: string
  outlookEmail: string
  googleEmail: string
  role?: string | null
  isActive: boolean
  accessModules?: number[] | null
  password: string
}
