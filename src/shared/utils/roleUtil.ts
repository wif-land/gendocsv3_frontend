import { mainNavigation } from '../constants/appNavigation'
import { IRoleType } from '../constants/appRoles'

export const validAccessToRoute = (userRole: IRoleType[], path: string) => {
  let haveAccess = false
  Object.keys(mainNavigation).forEach((nav) => {
    if (path === mainNavigation[nav].href) {
      const navMain = mainNavigation[nav]
      const accessByRol =
        !navMain.roleControl ||
        navMain.roleControl.every((itemRole) => userRole?.includes(itemRole))
      if (accessByRol) {
        haveAccess = true
      }
    }
  })
  return haveAccess
}
