import { create, StateCreator } from 'zustand'
import { IFunctionary } from '../../domain/entities/IFunctionary'
import { createJSONStorage, persist } from 'zustand/middleware'
import { FunctionaryUseCasesImpl } from '../../domain/usecases/FunctionaryServices'

interface StoreState {
  functionaries: IFunctionary[]
  setFunctionaries: (functionaries: IFunctionary[]) => void
  get: () => void
}

const STORE_NAME = 'functionaries-store'
const DEFAULT_FUNCTIONARIES: IFunctionary[] = []
const LIMIT = 5

export const useFunctionaryStore = create<StoreState>(
  persist(
    (set) => ({
      functionaries: DEFAULT_FUNCTIONARIES,
      setFunctionaries: (functionaries) => set({ functionaries }),
      get: async () => {
        const result = await FunctionaryUseCasesImpl.getInstance().getAll(
          LIMIT,
          0,
        )
        set({ functionaries: result.data.functionaries })
      },
    }),
    {
      name: STORE_NAME,
      storage: createJSONStorage(() => sessionStorage),
    },
  ) as StateCreator<StoreState>,
)
