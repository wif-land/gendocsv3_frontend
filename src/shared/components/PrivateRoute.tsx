import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useUserStore } from '../store/userStore'
import { getCookie } from '../utils/CookiesUtil'
import { ACCESS_TOKEN_COOKIE_NAME } from '../constants/appApiRoutes'

interface PrivateRouteProps {
  children: React.ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    if (getCookie(ACCESS_TOKEN_COOKIE_NAME) === null) {
      router.push('/login')
    }
  }, [])

  if (!user) {
    return null
  }

  return <>{children}</>
}

export default PrivateRoute
