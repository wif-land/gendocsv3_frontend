import { create, StateCreator } from 'zustand'
import { IPosition } from '../../domain/entities/IPosition'
import { createJSONStorage, persist } from 'zustand/middleware'
import { PositionUseCasesImpl } from '../../domain/usecases/PositionServices'
import { PaginationDTO } from '../../../../shared/utils/pagination-dto'

interface StoreState {
  positions: IPosition[]
  setPositions: (positions: IPosition[]) => void
  get: (pagination: PaginationDTO) => void
}

const STORE_NAME = 'positions-store'
const DEFAULT_POSITIONS: IPosition[] = []

export const usePositionStore = create<StoreState>(
  persist(
    (set) => ({
      positions: DEFAULT_POSITIONS,
      setPositions: (positions) => set({ positions }),
      get: async (pagination: PaginationDTO) => {
        const result =
          await PositionUseCasesImpl.getInstance().getAll(pagination)
        set({ positions: result.positions })
      },
    }),
    {
      name: STORE_NAME,
      storage: createJSONStorage(() => sessionStorage),
    },
  ) as StateCreator<StoreState>,
)
