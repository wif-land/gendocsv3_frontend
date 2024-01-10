import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { CouncilModel } from '../../data/models/CouncilModel'

interface StoreState {
  councils: CouncilModel[]
  setCouncils: (careers: CouncilModel[]) => void
}

const STORE_NAME = 'councils-store'
const DEFAULT_CAREERS: CouncilModel[] = []

export const useCouncilStore = create<StoreState>(
  persist(
    (set) => ({
      councils: DEFAULT_CAREERS,
      setCouncils: (councils) => set({ councils }),
    }),
    {
      name: STORE_NAME,
    },
  ) as StateCreator<StoreState>,
)
