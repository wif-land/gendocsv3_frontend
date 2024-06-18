'use client'

import { NextUIProvider } from '@nextui-org/react'
import { useSocketListeners } from './use-socket-notifications'

export function SocketProviders({ children }: { children: React.ReactNode }) {
  useSocketListeners()

  return <NextUIProvider>{children}</NextUIProvider>
}
