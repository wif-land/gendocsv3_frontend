import { useEffect, useState } from 'react'
import { socketClient } from '../integrations/socket-client'
import { useNotificationStore } from '../../features/notifications/store/useNotificationStore'
import { useAccountStore } from '../../features/auth/presentation/state/useAccountStore'
import { IRootNotification } from '../../features/notifications/data/entities/IRootNotification'
import { filterByScope } from '../../features/notifications/utils/filter-by-scope'
import { enqueueSnackbar, closeSnackbar } from 'notistack'
import {
  NotificationStatus,
  notificationStatusColor,
} from '../../features/notifications/utils/notification-status'
import { UserModel } from '@/features/users/data/models/UserModel'

export const useSocketListeners = () => {
  const [firstLoad, setFirstLoad] = useState(true)
  const { addNotification, setNotifications } = useNotificationStore()
  const { user, setUser } = useAccountStore()

  const loadUserNotifications = () => {
    if (!user) return
    socketClient.emit('user-notifications', { userId: user.id, limit: 15 })
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
        enqueueSnackbar(
          `${data.notification.name} ${data.notification.status}`,
          {
            key: data.notification.id,
            variant: notificationStatusColor(data.notification.status),
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            persist:
              data.notification.status === NotificationStatus.IN_PROGRESS,
            preventDuplicate: true,
          },
        )

        if (data.notification.status !== NotificationStatus.IN_PROGRESS) {
          closeSnackbar(data.notification.id)

          enqueueSnackbar(
            `${data.notification.name} ${data.notification.status}`,
            {
              key: data.notification.id + 1,
              variant: notificationStatusColor(data.notification.status),
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              autoHideDuration: 5000,
            },
          )
        }
      }
    })

    socketClient.off('user-notifications')
    socketClient.on('user-notifications', (data: IRootNotification[]) => {
      if (!user) return
      setNotifications(data)
    })

    socketClient.off('change-user')
    socketClient.on('change-user', (data: { id: number; user: UserModel }) => {
      if (!user) return
      if (user.id == data.id) {
        setUser({
          ...user,
          ...data.user,
          id: user.id,
        })

        console.log('user updated', data.user)

        enqueueSnackbar('Se ha actualizado su información', {
          variant: 'success',
        })
      }
    })

    return () => {
      socketClient.off('notification')
      socketClient.off('user-notifications')
      socketClient.off('change-user')
    }
  }, [])
}
