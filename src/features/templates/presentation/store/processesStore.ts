import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { ProcessModel, TemplateModel } from '../../data/models/TemplatesModel'

interface StoreState {
  processes: ProcessModel[]
  setProcesses: (processes: ProcessModel[]) => void
  setProcessTemplates: (
    processId: number,
    processTemplates: TemplateModel[],
  ) => void
  isLoading: boolean
}

const STORE_NAME = 'processes-store'
const DEFAULT_PROCESSES: ProcessModel[] = []

export const useProcessStore = create<StoreState>(
  persist(
    (set, get) => ({
      isLoading: false,
      processes: DEFAULT_PROCESSES,
      setProcesses: (processes) => {
        set({ isLoading: true })
        set({ processes })
        set({ isLoading: false })
      },
      setProcessTemplates: (processId: number, processTemplates) => {
        const processToChange = get().processes.find(
          (process) => process.id === processId,
        )
        if (processToChange) {
          processToChange.templateProcesses = processTemplates
          set({ processes: get().processes })
        }
      },
    }),
    {
      name: STORE_NAME,
    },
  ) as StateCreator<StoreState>,
)
