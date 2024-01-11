import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { ProcessModel } from '../../data/models/ProcessesModel'

interface StoreState {
  processes: ProcessModel[]
  setProcesses: (processes: ProcessModel[]) => void
  isLoading: boolean
}

const STORE_NAME = 'processes-store'
const DEFAULT_PROCESSES: ProcessModel[] = []

export const useProcessStore = create<StoreState>(
  persist(
    (set) => ({
      isLoading: false,
      processes: DEFAULT_PROCESSES,
      setProcesses: (processes) => {
        set({ isLoading: true })
        set({ processes })
        set({ isLoading: false })
      },
    }),
    {
      name: STORE_NAME,
    },
  ) as StateCreator<StoreState>,
)
