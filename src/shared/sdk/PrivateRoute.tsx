import { useEffect } from 'react'
import { useAccountStore } from '../../features/auth/presentation/state/useAccountStore'
import { getCookie } from '../utils/CookiesUtil'
import { ACCESS_TOKEN_COOKIE_NAME } from '../constants/appApiRoutes'

interface PrivateRouteProps {
  children: React.ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useAccountStore()
  
  if (!user || user === null) {
    return null
  }

  return <>{children}</>
}

export default PrivateRoute
