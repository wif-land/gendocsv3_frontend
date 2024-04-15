import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { CouncilModel } from '../../data/models/DefaultMembersModel'

interface StoreState {
  councils: CouncilModel[]
  setCouncils: (careers: CouncilModel[]) => void
  addCouncil: (career: CouncilModel) => void
}

const STORE_NAME = 'councils-store'
const DEFAULT_COUNCILS: CouncilModel[] = []

export const useCouncilStore = create<StoreState>(
  persist(
    (set) => ({
      councils: DEFAULT_COUNCILS,
      setCouncils: (councils) => set({ councils }),
      addCouncil: (council: CouncilModel) =>
        set((state) => ({ councils: [...state.councils, council] })),
    }),
    {
      name: STORE_NAME,
    },
  ) as StateCreator<StoreState>,
)
