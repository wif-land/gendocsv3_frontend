'use client'
import { io } from 'socket.io-client'

import { APP_SOCKET_ROUTE } from '@/shared/constants/appSocketRoutes'
export const socketClient = io(APP_SOCKET_ROUTE)
