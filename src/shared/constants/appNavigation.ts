import { IRoleType } from '../../features/auth/types/IUserAccount'
import { appPrivateRoutes, appPublicRoutes } from './appPublicRoutes'
import appRoles from './appRoles'
import { appRoutes } from './appRoutes'
import icons from './icons'

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
    name: appRoutes.leadsCapture.name,
    href: appPrivateRoutes.leadsCapture,
    urlReference: appRoutes.leadsCapture.urlReference,
    roleControl: [appRoles['admin'].id],
    // customHeaderRight: <CustomHeaderLeadsCapture />,
  },
}

export const mainNavigation: { [name: string]: INavigationItem } = {
  ...biHubleadsNavigation,
}
