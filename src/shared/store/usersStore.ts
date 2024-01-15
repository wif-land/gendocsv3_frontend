import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { setCookie } from '../utils/CookiesUtil'
import { IUser } from '../../features/auth/types/IUser'
import { ACCESS_TOKEN_COOKIE_NAME } from '../constants/appApiRoutes'
import { UsersApi } from '../../features/users/api/users'

interface StoreState {
  users: IUser[] | undefined
  setUsers: (user: IUser[]) => void
  load: () => void
}

export const useUsersStore = create<StoreState>(
  persist(
    (set) => ({
      users: undefined,
      setUsers: (users: IUser[]) => set({ users }),
      logout: () => {
        set({ users: undefined })
        setCookie(ACCESS_TOKEN_COOKIE_NAME, null)
      },
      load: async () => {
        const result = await UsersApi.get()
        set({ users: result.users })
      },
    }),
    {
      name: 'users-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ) as StateCreator<StoreState>,
)
