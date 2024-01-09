import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { IProcess } from '../../features/process/types/IProcess'
import { ProcessApi } from '../../features/process/api/processes'

interface StoreState {
  processes: IProcess[] | undefined
  setProcesses: (processes?: IProcess[] | undefined) => void
  get: () => void
}

const STORE_NAME = 'processes-store'
export const useProcessesStore = create<StoreState>(
  persist(
    (set) => ({
      processes: undefined,
      setProcesses: (processes) => set({ processes }),
      get: async () => {
        const result = await ProcessApi.fetchProcesses()
        set({ processes: result.processes })
      },
    }),
    {
      name: STORE_NAME,
      storage: createJSONStorage(() => sessionStorage),
    },
  ) as StateCreator<StoreState>,
)
