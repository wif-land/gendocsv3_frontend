import { create, StateCreator } from 'zustand'
import { IFunctionary } from '../../domain/entities/IFunctionary'
import { createJSONStorage, persist } from 'zustand/middleware'
import { FunctionaryUseCasesImpl } from '../../domain/usecases/FunctionaryServices'
import { PaginationDTO } from '../../../../shared/utils/pagination-dto'

interface StoreState {
  functionaries: IFunctionary[]
  setFunctionaries: (functionaries: IFunctionary[]) => void
  get: () => void
}

const STORE_NAME = 'functionaries-store'
const DEFAULT_FUNCTIONARIES: IFunctionary[] = []

export const useFunctionaryStore = create<StoreState>(
  persist(
    (set) => ({
      functionaries: DEFAULT_FUNCTIONARIES,
      setFunctionaries: (functionaries) => set({ functionaries }),
      get: async () => {
        const result = await FunctionaryUseCasesImpl.getInstance().getAll(
          new PaginationDTO(1, 5),
        )
        set({ functionaries: result.functionaries })
      },
    }),
    {
      name: STORE_NAME,
      storage: createJSONStorage(() => sessionStorage),
    },
  ) as StateCreator<StoreState>,
)
