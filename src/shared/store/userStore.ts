import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { IResponseUser } from '../../features/auth/types/IUser'
import { setCookie } from '../utils/CookiesUtil'

interface StoreState {
  user: IResponseUser | undefined
  setUser: (user: IResponseUser) => void
  logout: () => void
}

export const useUserStore = create<StoreState>(
  persist(
    (set) => ({
      user: undefined,
      setUser: (user?: IResponseUser | undefined) => set({ user }),
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
