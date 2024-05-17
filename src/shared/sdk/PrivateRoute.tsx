import { useEffect } from 'react'
import { useAccountStore } from '../../features/auth/presentation/state/useAccountStore'
import { getCookie } from '../utils/CookiesUtil'
import { ACCESS_TOKEN_COOKIE_NAME } from '../constants/appApiRoutes'

interface PrivateRouteProps {
  children: React.ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useAccountStore()
  // const router = useRouter()

  useEffect(() => {
    let isMounted = true


    const handleGetCookies = () => {
      if (
        (getCookie(ACCESS_TOKEN_COOKIE_NAME) === null ||
          user === null ||
          !user) &&
        isMounted
      ) {
        // router.push(appPublicRoutes.login)
      }
    }

    handleGetCookies()

    return () => {
      isMounted = false
    }
  }, [])

  if (!user || user === null) {
    return null
  }

  return <>{children}</>
}

export default PrivateRoute
