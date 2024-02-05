export type IRoleType = 'ADMIN' | 'WRITER' | 'READER'

export interface IUser {
  id: number
<<<<<<< HEAD
  sub?: number
=======
  sub: number
>>>>>>> 0e6dd35ba4605ea615ce3b09fb7a667ee1f7b792
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
  id: number
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
  sub: number
  id: number
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
