import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { DefaultMemberModel } from '../../data/models/DefaultMembersModel'

interface StoreState {
  members: DefaultMemberModel[]
  setDefaultMembers: (careers: DefaultMemberModel[]) => void
  addDefaultMembers: (career: DefaultMemberModel) => void
}

const STORE_NAME = 'default-members-store'
const DEFAULT_MEMBERS: DefaultMemberModel[] = []

export const useDefaultMembers = create<StoreState>(
  persist(
    (set) => ({
      members: DEFAULT_MEMBERS,
      setDefaultMembers: (members) => set({ members }),
      addDefaultMembers: (member) =>
        set((state) => ({ members: [...state.members, member] })),
    }),
    {
      name: STORE_NAME,
    },
  ) as StateCreator<StoreState>,
)
