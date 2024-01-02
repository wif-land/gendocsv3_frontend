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

export const biVehicleIntelligenceNavigation: {
  [name: string]: IAppNavigationWithSubItems
} = {
  analyticsDashboard: {
    name: 'Dashboard de analítica',
    icon: icons.ANALYTICS_DASHBOARD,
    subRoutes: {
      summary: {
        name: appRoutes.summary.name,
        href: appPrivateRoutes.summary,
        urlReference: appRoutes.summary.urlReference,
        roleControl: [appRoles.admin.id],
      },
    },
  },
}

export const publicNavigation: { [name: string]: INavigationItem } = {
  models: {
    name: appRoutes.models.name,
    href: appPublicRoutes.models,
    urlReference: appPublicRoutes.models,
  },
  pointOfSales: {
    name: appRoutes.pointOfSales.name,
    href: appPublicRoutes.pointOfSales,
    urlReference: appPublicRoutes.pointOfSales,
  },
}

export const mainNavigation: { [name: string]: INavigationItem } = {
  selectPlatform: {
    name: appRoutes.selectPlatform.name,
    href: appRoutes.selectPlatform.url,
  },
  ...biHubleadsNavigation,
  ...biVehicleIntelligenceNavigation.analyticsDashboard.subRoutes,
  ...publicNavigation,
}
