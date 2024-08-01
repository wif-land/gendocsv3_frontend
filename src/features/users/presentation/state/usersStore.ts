import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { IUser } from '../../domain/entities/IUser'
import { UserDataSourceImpl } from '../../data/datasources/UserDatasource'

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
      load: async () => {
        const result = await UserDataSourceImpl.getInstance().getAll()
        set({ users: result.users as IUser[] })
      },
    }),
    {
      name: STORE_NAME,
      storage: createJSONStorage(() => sessionStorage),
    },
  ) as StateCreator<StoreState>,
)
