export interface IAccountUser {
  username: string
  roles: IRoleType[]
  platformPermission: string[]
}

export type IRoleType = 'admin' | 'writer' | 'reader'

export interface IUser{
  exp: number;
  iat: number;
  platformPermission: string | null;
  roles: string[];
  sub: number;
  username: string;
}