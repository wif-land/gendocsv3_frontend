export type IRoleType = 'admin' | 'writer' | 'reader'

export interface IUser {
  id: number
  firstName: string
  secondName: string
  firstLastName: string
  secondLastName: string
  outlookEmail: string
  googleEmail: string
  roles?: string[] | null
  isActive: boolean
  accessModules?: AccessModulesEntity[] | null
}
export interface AccessModulesEntity {
  id: number
  createdAt: string
  updatedAt: string
  code: string
  name: string
  submodules?: (SubmodulesEntity | null)[] | null
}
export interface SubmodulesEntity {
  id: number
  createdAt: string
  updatedAt: string
  name: string
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
  accessModules?: string[] | null
}
