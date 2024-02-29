import { create, StateCreator } from 'zustand'
import { IPosition } from '../../domain/entities/IPosition'
import { createJSONStorage, persist } from 'zustand/middleware'
import { PositionUseCasesImpl } from '../../domain/usecases/PositionServices'

interface StoreState {
  positions: IPosition[]
  setPositions: (positions: IPosition[]) => void
  get: (limit: number, offset: number) => void
}

const STORE_NAME = 'positions-store'
const DEFAULT_POSITIONS: IPosition[] = []

export const usePositionStore = create<StoreState>(
  persist(
    (set) => ({
      positions: DEFAULT_POSITIONS,
      setPositions: (positions) => set({ positions }),
      get: async (limit: number, offset: number) => {
        const result = await PositionUseCasesImpl.getInstance().getAll(
          limit,
          offset,
        )
        set({ positions: result.data.positions })
      },
    }),
    {
      name: STORE_NAME,
      storage: createJSONStorage(() => sessionStorage),
    },
  ) as StateCreator<StoreState>,
)
