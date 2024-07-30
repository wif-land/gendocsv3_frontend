import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { IDefaultMembers } from '../../domain/entities/IDefaultMembers'
import { DefaultMembersUseCasesImpl } from '../../domain/usecases/DefaultMemberServices'

interface StoreState {
  defaultMembers: IDefaultMembers[]
  loading: boolean
  setDefaultMembers: (members: IDefaultMembers[]) => void
  addDefaultMembers: (member: IDefaultMembers) => void
  getByModuleId: (moduleId: number) => void
}

const STORE_NAME = 'default-members-store'
const DEFAULT_MEMBERS: IDefaultMembers[] = []

export const useDefaultMembersStore = create<StoreState>(
  persist(
    (set) => ({
      defaultMembers: DEFAULT_MEMBERS,
      loading: false,
      getByModuleId: async (moduleId) => {
        set({ loading: true })
        const defaultMembers =
          await DefaultMembersUseCasesImpl.getInstance().getByModuleId(moduleId)
        set({ defaultMembers, loading: false })
      },
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
