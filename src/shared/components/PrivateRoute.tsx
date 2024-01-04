import { useEffect } from 'react'
import { useUserStore } from '../store/userProfileStore'
import { getCookie } from '../utils/CookiesUtil'
import { ACCESS_TOKEN_COOKIE_NAME } from '../constants/appApiRoutes'

interface PrivateRouteProps {
  children: React.ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useUserStore()
  // const router = useRouter()

  useEffect(() => {
    if (
      getCookie(ACCESS_TOKEN_COOKIE_NAME) === null ||
      user === null ||
      !user
    ) {
      // router.push(appPublicRoutes.login)
    }
  }, [])

  if (!user || user === null) {
    return null
  }

  return <>{children}</>
}

export default PrivateRoute
