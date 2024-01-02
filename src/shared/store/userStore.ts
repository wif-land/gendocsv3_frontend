import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { IUser } from '../../features/auth/types/IUser'
import { setCookie } from '../utils/CookiesUtil'

interface StoreState {
  user: IUser | undefined
  setUser: (user: IUser) => void
  logout: () => void
}

export const useUserStore = create<StoreState>(
  persist(
    (set) => ({
      user: undefined,
      setUser: (user?: IUser | undefined) => set({ user }),
      logout: () => {
        setCookie('access_token', null)
        set({ user: undefined })
      },
    }),
    {
      name: 'user',
    },
  ) as StateCreator<StoreState>,
)
