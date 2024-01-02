export type IRoleType = 'admin' | 'writer' | 'reader'

export interface IUser {
  exp: number
  iat: number
  platformPermission: string | null
  roles: IRoleType[]
  sub: number
  username: string
  accessModulesIds: number[]
}

export interface IResponseUser {
  id: number
  firstName: string
  secondName: string
  firstLastName: string
  secondLastName: string
  outlookEmail: string
  googleEmail: string
  roles?: string[] | null
  platformPermission?: null
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
