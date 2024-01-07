import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { setCookie } from '../utils/CookiesUtil'
import { IUser } from '../../features/auth/types/IUser'
import { ACCESS_TOKEN_COOKIE_NAME } from '../constants/appApiRoutes'

interface StoreState {
  user: IUser | undefined
  users: IUser[] | undefined
  setUser: (user: IUser) => void
  logout: () => void
}

export const useUserStore = create<StoreState>(
  persist(
    (set) => ({
      user: undefined,
      users: undefined,
      setUser: (user?: IUser | undefined) => set({ user }),
      logout: () => {
        set({ user: undefined })
        setCookie(ACCESS_TOKEN_COOKIE_NAME, null)
      },
      setUsers: (users?: IUser[] | undefined) => set({ users }),
    }),
    {
      name: 'user',
      storage: createJSONStorage(() => sessionStorage),
    },
  ) as StateCreator<StoreState>,
)
