import { create, StateCreator } from 'zustand'
import { IFunctionary } from '../../features/functionaries/types/IFunctionary'
import { FunctionariesApi } from '../../features/functionaries/api/functionaries'
import { createJSONStorage, persist } from 'zustand/middleware'

interface StoreState {
  functionaries: IFunctionary[] | undefined
  setFunctionaries: (functionaries?: IFunctionary[] | undefined) => void
  get: () => void
}

const STORE_NAME = 'functionaries-store'
export const useFunctionaryStore = create<StoreState>(
  persist(
    (set) => ({
      functionaries: undefined,
      setFunctionaries: (functionaries) => set({ functionaries }),
      get: async () => {
        const result = await FunctionariesApi.fetchFunctionaries()
        set({ functionaries: result.functionaries })
      },
    }),
    {
      name: STORE_NAME,
      storage: createJSONStorage(() => sessionStorage),
    },
  ) as StateCreator<StoreState>,
)
