export enum UserType {
  ADMIN = 'ADMIN',
  WRITER = 'WRITER',
  READER = 'READER',
  API = 'API',
}

export const UserTypeLabels = {
  [UserType.ADMIN]: 'Administrador',
  [UserType.WRITER]: 'Escritor',
  [UserType.READER]: 'Lector',
  [UserType.API]: 'API',
}

export const USER_TYPES = Object.keys(UserType).map((key) => ({
  label: UserTypeLabels[key as keyof typeof UserType],
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
  roles: string[]
  isActive: boolean
  accessModules: number[]
}
