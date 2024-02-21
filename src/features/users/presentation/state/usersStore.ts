import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { setCookie } from '../../../../shared/utils/CookiesUtil'
import { IUser } from '../../../auth/domain/entities/IUser'
import { ACCESS_TOKEN_COOKIE_NAME } from '../../../../shared/constants/appApiRoutes'
import { UsersApi } from '../../api/users'

interface StoreState {
  users: IUser[]
  setUsers: (user: IUser[]) => void
  load: () => void
}

const STORE_NAME = 'users-storage'
const DEFAULT_USERS: IUser[] = []

export const useUsersStore = create<StoreState>(
  persist(
    (set) => ({
      users: DEFAULT_USERS,
      setUsers: (users: IUser[]) => set({ users }),
      logout: () => {
        set({ users: DEFAULT_USERS })
        setCookie(ACCESS_TOKEN_COOKIE_NAME, null)
      },
      load: async () => {
        const result = await UsersApi.get()
        set({ users: result.users })
      },
    }),
    {
      name: STORE_NAME,
      storage: createJSONStorage(() => sessionStorage),
    },
  ) as StateCreator<StoreState>,
)
