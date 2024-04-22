import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { DefaultMemberModel } from '../../data/models/DefaultMembersModel'

interface StoreState {
  defaultMembers: DefaultMemberModel[]
  setDefaultMembers: (members: DefaultMemberModel[]) => void
  addDefaultMembers: (member: DefaultMemberModel) => void
}

const STORE_NAME = 'default-members-store'
const DEFAULT_MEMBERS: DefaultMemberModel[] = []

export const useDefaultMembersStore = create<StoreState>(
  persist(
    (set) => ({
      defaultMembers: DEFAULT_MEMBERS,
      setDefaultMembers: (defaultMembers) => set({ defaultMembers }),
      addDefaultMembers: (member) =>
        set((state) => ({ defaultMembers: [...state.defaultMembers, member] })),
    }),
    {
      name: STORE_NAME,
    },
  ) as StateCreator<StoreState>,
)
