'use client'

import { NextUIProvider } from '@nextui-org/react'
import { useSocketListeners } from './use-socket-notifications'
import { useEffect } from 'react'

export function SocketProviders({ children }: { children: React.ReactNode }) {
  useSocketListeners()

  const { loadUserNotifications } = useSocketListeners()

  useEffect(() => {
    loadUserNotifications()
  }, [loadUserNotifications])

  return <NextUIProvider>{children}</NextUIProvider>
}
