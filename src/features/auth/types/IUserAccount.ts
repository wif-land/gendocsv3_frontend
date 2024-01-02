export interface IAccountUser {
  username: string
  roles: IRoleType[]
  platformPermission: string[]
}

export type IRoleType = 'admin' | 'writer' | 'reader' | 'api' | 'public'
