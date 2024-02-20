import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { setCookie } from '../../../../shared/utils/CookiesUtil'
import { IUser } from '../../domain/entities/IUser'
import { ACCESS_TOKEN_COOKIE_NAME } from '../../../../shared/constants/appApiRoutes'

interface StoreState {
  user: IUser | undefined
  setUser: (user: IUser) => void
  logout: () => void
}

const DEFAULT_USER: IUser = {
  id: 0,
  firstLastName: '',
  firstName: '',
  googleEmail: '',
  isActive: false,
  outlookEmail: '',
  secondLastName: '',
  secondName: '',
  sub: 0,
}

const STORE_NAME = 'user'

export const useAccountStore = create<StoreState>(
  persist(
    (set) => ({
      user: DEFAULT_USER,
      setUser: (user?: IUser | undefined) => {
        set({ user })
      },
      logout: () => {
        set({ user: undefined })
        setCookie(ACCESS_TOKEN_COOKIE_NAME, null)
      },
    }),
    {
      name: STORE_NAME,
    },
  ) as StateCreator<StoreState>,
)
