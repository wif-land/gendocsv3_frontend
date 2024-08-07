/* eslint-disable @typescript-eslint/no-explicit-any */
export enum UserRole {
  ADMIN = 'ADMIN',
  WRITER = 'WRITER',
  READER = 'READER',
  API = 'API',
  TEMP_ADMIN = 'TEMP_ADMIN',
}

export const UserTypeLabels = {
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.WRITER]: 'Escritor',
  [UserRole.READER]: 'Lector',
  [UserRole.API]: 'API',
  [UserRole.TEMP_ADMIN]: 'Administrador temporal',
}

export const USER_TYPES = Object.keys(UserRole).map((key) => ({
  label: UserTypeLabels[key as keyof typeof UserRole],
  value: key,
}))

export interface IUser {
  id?: number
  firstName: string
  secondName: string
  firstLastName: string
  secondLastName: string
  outlookEmail: string
  googleEmail: string
  password?: string
  role: UserRole
  isActive: boolean
  accessModules: number[] | any[]
  accessCareersDegCert?: number[] | any[]
}
