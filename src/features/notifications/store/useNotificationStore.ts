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
    (set) => ({
      notifications: DEFAULT_NOTIFICATIONS,
      setNotifications: (notifications) => set({ notifications }),
      addNotification: (notification, user) => {
        if (filterByScope(notification, user)) {
          set((state) => ({
            notifications: [...state.notifications, notification],
          }))
        }
      },
    }),
    {
      name: STORE_NAME,
    },
  ) as StateCreator<StoreState>,
)
