import { create, StateCreator } from 'zustand'
import { IRootNotification } from '../data/entities/IRootNotification'
import { persist } from 'zustand/middleware'
import { filterByScope } from '../utils/filter-by-scope'
import { IUser } from '../../../features/auth/domain/entities/IUser'

interface StoreState {
  notifications: IRootNotification[]
  setNotifications: (notifications: IRootNotification[]) => void
  addNotification: (notification: IRootNotification, user: IUser) => void
}

const STORE_NAME = 'notifications-store'

const DEFAULT_NOTIFICATIONS: IRootNotification[] = []

export const useNotificationStore = create<StoreState>(
  persist(
    (set, get) => ({
      notifications: DEFAULT_NOTIFICATIONS,
      setNotifications: (notifications) => {
        set({ notifications })
      },
      addNotification: (notification, user) => {
        if (filterByScope(notification, user)) {
          const inListNotification = get().notifications.find(
            (n) => n.notification.id === notification.notification.id,
          )
          if (inListNotification) {
            set((state) => ({
              notifications: state.notifications.map((n) =>
                n.notification.id === notification.notification.id
                  ? notification
                  : n,
              ),
            }))
            return
          }

          set((state) => ({
            notifications: [notification, ...state.notifications],
          }))
        }
      },
    }),
    {
      name: STORE_NAME,
    },
  ) as StateCreator<StoreState>,
)
