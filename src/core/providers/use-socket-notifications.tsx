import { useEffect, useState } from 'react'
import { socketClient } from '../integrations/socket-client'
import { useNotificationStore } from '../../features/notifications/store/useNotificationStore'
import { useAccountStore } from '../../features/auth/presentation/state/useAccountStore'
import { IRootNotification } from '../../features/notifications/data/entities/IRootNotification'
import { filterByScope } from '../../features/notifications/utils/filter-by-scope'
import { enqueueSnackbar, closeSnackbar, OptionsObject } from 'notistack'
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
    if (!user || user.id === 0 || !socketClient.connected || !firstLoad) {
      return
    }
    try {
      console.log('Loading user notifications')
      socketClient.emit('user-notifications', { userId: user.id, limit: 15 })
      setFirstLoad(false)
      socketClient.off('user-notifications')
    } catch (error) {
      console.error('Failed to load user notifications:', error)
    }
  }

  useEffect(() => {
    const handleNotification = (data: IRootNotification) => {
      try {
        addNotification(data, user!)
        if (filterByScope(data, user!)) {
          const notificationOpts = {
            key: data.notification.id,
            variant: notificationStatusColor(data.notification.status),
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            persist:
              data.notification.status === NotificationStatus.IN_PROGRESS,
            preventDuplicate: true,
          } as OptionsObject<
            'success' | 'warning' | 'info' | 'error' | 'default'
          >

          enqueueSnackbar(
            `${data.notification.name} ${data.notification.status}`,
            notificationOpts,
          )

          if (data.notification.status !== NotificationStatus.IN_PROGRESS) {
            closeSnackbar(data.notification.id)
            notificationOpts.key = `${data.notification.id}-autohide`
            notificationOpts.autoHideDuration = 5000
            enqueueSnackbar(
              `${data.notification.name} ${data.notification.status}`,
              notificationOpts,
            )
          }
        }
      } catch (error) {
        console.error('Error handling notification:', error)
      }
    }

    // Registering event listeners only if user is valid and on first load
    if (firstLoad) {
      loadUserNotifications()
    }

    socketClient.on('notification', handleNotification)

    socketClient.on('user-notifications', setNotifications)

    socketClient.on('change-user', (data: { id: number; user: UserModel }) => {
      if (user?.id === data.id) {
        setUser({
          ...user,
          ...data.user,
          id: user.id,
        })
        console.log('User updated', data.user)
        enqueueSnackbar('Se ha actualizado su información', {
          variant: 'success',
        })
      }
    })

    // Clean up function to remove listeners when the component unmounts or when the dependencies change
    return () => {
      socketClient.off('notification', handleNotification)
      socketClient.off('user-notifications', setNotifications)
      socketClient.off('change-user')
    }
  }, [user, firstLoad]) // Adding dependencies to ensure that listeners are setup and teardown properly based on these values

  return { loadUserNotifications }
}
