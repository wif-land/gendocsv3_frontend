import { appPublicRoutes, appPrivateRoutes } from './appPublicRoutes'

export type IRoleType = 'admin' | 'public'

type IRolesInterface = {
  [name in IRoleType]: {
    id: IRoleType
    name: string
    accessRoutes: { [name: string]: string }
    redirectPath: string
  }
}

const appRoles: IRolesInterface = {
  admin: {
    id: 'admin',
    name: 'Administrador',
    accessRoutes: appPrivateRoutes,
    redirectPath: appPrivateRoutes.dashboard,
  },
  public: {
    id: 'public',
    name: 'Público',
    accessRoutes: appPublicRoutes,
    redirectPath: appPublicRoutes.login,
  },
}

export default appRoles
