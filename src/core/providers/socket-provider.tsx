'use client'

import { usePathname } from 'next/navigation'
import { useSocketListeners } from './use-socket-notifications'
import { useEffect } from 'react'

export function SocketProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { loadUserNotifications } = useSocketListeners()

  useEffect(() => {
    if (
      pathname === 'login' ||
      pathname === 'new-password' ||
      pathname === 'auth'
    )
      return

    loadUserNotifications()
  }, [pathname, loadUserNotifications])

  return <>{children}</>
}
