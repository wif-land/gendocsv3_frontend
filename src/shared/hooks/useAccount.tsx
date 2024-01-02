'use client'

import { usePathname } from 'next/navigation'
import { validAccessToRoute } from '../utils/roleUtil'
import { getCookie } from '../utils/CookiesUtil'

export const useAccount = () => {
  const pathname = usePathname()
  // const account = useSelector(
  //   (state: IApp) => state.accountReducer.activeUserAccount,
  // )
  const haveAccessToRoute = validAccessToRoute([], pathname)

  return {
    isLoggedIn: getCookie('access_token') !== undefined,
    haveRoles: 1,
    userRoles: ['admin'],
    haveAccessToRoute,
    user: getCookie('access_token'),
  }
}
