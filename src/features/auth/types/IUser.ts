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
  roles?: string[] | null
  isActive: boolean
  accessModules?: number[] | null
}

export interface IUserPayload {
  sub: number
  firstName: string
  secondName: string
  firstLastName: string
  secondLastName: string
  outlookEmail: string
  googleEmail: string
  roles?: string[] | null
  isActive: boolean
  accessModules?: number[] | null
}

export interface ICreateUser {
  firstName: string
  secondName: string
  firstLastName: string
  secondLastName: string
  outlookEmail: string
  googleEmail: string
  roles?: string[] | null
  isActive: boolean
  accessModules?: number[] | null
  password: string
}
