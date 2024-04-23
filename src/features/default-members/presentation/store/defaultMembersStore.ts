import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { IDefaultMembers } from '../../domain/entities/DefaultMembers'

interface StoreState {
  defaultMembers: IDefaultMembers[]
  setDefaultMembers: (members: IDefaultMembers[]) => void
  addDefaultMembers: (member: IDefaultMembers) => void
}

const STORE_NAME = 'default-members-store'
const DEFAULT_MEMBERS: IDefaultMembers[] = []

export const useDefaultMembersStore = create<StoreState>(
  persist(
    (set) => ({
      defaultMembers: DEFAULT_MEMBERS,
      setDefaultMembers: (defaultMembers) => set({ defaultMembers }),
      addDefaultMembers: (member) =>
        set((state) => ({
          defaultMembers: [...state.defaultMembers, member],
        })),
    }),
    {
      name: STORE_NAME,
    },
  ) as StateCreator<StoreState>,
)
