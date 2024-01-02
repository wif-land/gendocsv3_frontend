import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useUserStore } from '../store/userStore'
import { getCookie } from '../utils/CookiesUtil'

interface PrivateRouteProps {
  children: React.ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    if (!user || getCookie('token') === null) {
      router.push('/')
    }
  }, [])

  if (!user) {
    return null
  }

  return <>{children}</>
}

export default PrivateRoute
