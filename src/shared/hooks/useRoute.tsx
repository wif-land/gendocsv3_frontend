import { appPublicRoutes, appPrivateRoutes } from '../constants/appPublicRoutes'
import { IRoleType } from '../../features/auth/types/IUserAccount'
import { usePathname, useRouter } from 'next/navigation'

export const useRoute = () => {
  const router = useRouter()
  const pathname = usePathname()

  const redirectToMainPage = () => router.push('/dashboard')

  const redirectToLoginPage = () => router.push(appPublicRoutes.login)

  const haveAccesToThisRoute = (roles: IRoleType[], userRoles: IRoleType[]) =>
    !!roles?.filter((element) => userRoles.includes(element)).length

  return {
    currentRoute: pathname,
    isPublicRoute: Object.values(appPublicRoutes).includes(pathname),
    is404Page: ['/404'].includes(pathname),
    isRootPage: ['/'].includes(pathname),
    isAuthRoute: Object.values(appPrivateRoutes).includes(pathname),
    isLoginRoute: ['/login'].includes(pathname),
    redirectToMainPage,
    redirectToLoginPage,
    haveAccesToThisRoute,
  }
}
