import { appPrivateRoutes } from './appPublicRoutes'
import appRoles, { IRoleType } from './appRoles'
import { appRoutes } from './appRoutes'

export type customLinkActions = 'dispatch' | 'link'

export interface INavigationItem {
  name: string
  title?: string
  href?: string
  urlReference?: string
  roleControl?: IRoleType[]
  customHeaderRight?: React.ReactElement
  icon?: string
}
export interface IAppNavigationWithSubItems {
  name: string
  icon: string
  subRoutes: { [key: string]: INavigationItem }
}

const biHubleadsNavigation: { [name: string]: INavigationItem } = {
  dashboard: {
    name: 'Dashboard',
    href: appPrivateRoutes.dashboard,
    urlReference: appRoutes.dashboard.url,
    roleControl: [appRoles['admin'].id],
    // customHeaderRight: <CustomHeaderLeadsCapture />,
  },
}

export const mainNavigation: { [name: string]: INavigationItem } = {
  ...biHubleadsNavigation,
}
