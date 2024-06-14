import { useEffect, useState } from 'react'
import { socketClient } from '../clients/socket-client'
import { useNotificationStore } from '@/features/notifications/store/useNotificationStore'
import { useAccountStore } from '@/features/auth/presentation/state/useAccountStore'
import { IRootNotification } from '@/features/notifications/data/entities/IRootNotification'
import { filterByScope } from '@/features/notifications/utils/filter-by-scope'
import { enqueueSnackbar } from 'notistack'
import { notificationStatusColor } from '@/features/notifications/utils/notification-status'

export const useSocketListeners = () => {
  const [firstLoad, setFirstLoad] = useState(true)
  const { addNotification, setNotifications } = useNotificationStore()
  const { user } = useAccountStore()

  const loadUserNotifications = () => {
    if (!user) return
    socketClient.emit('user-notifications', { userId: user.id })
  }

  useEffect(() => {
    if (firstLoad) {
      loadUserNotifications()
      setFirstLoad(false)
    }

    socketClient.off('notification')
    socketClient.on('notification', (data: IRootNotification) => {
      if (!user) return
      addNotification(data, user)

      if (filterByScope(data, user)) {
        // show notification
        enqueueSnackbar(
          `${data.notification.name} ${data.notification.status}`,
          {
            variant: notificationStatusColor(data.notification.status),
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            transitionDuration: 1500,
          },
        )
      }
    })

    socketClient.on('user-notifications', (data: IRootNotification[]) => {
      if (!user) return
      setNotifications(data)
    })

    return () => {
      socketClient.off('notification')
    }
  }, [])
}
