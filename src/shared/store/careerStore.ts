import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { ICareer } from '../../features/careers/interfaces/ICareer'

interface StoreState {
  careers: ICareer[] | undefined
  setCareers: (careers?: ICareer[] | undefined) => void
}

const STORE_NAME = 'careers-store'
const DEFAULT_CAREERS: ICareer[] = []

export const useCareersStore = create<StoreState>(
  persist(
    (set) => ({
      careers: DEFAULT_CAREERS,
      setCareers: (careers) => set({ careers }),
    }),
    {
      name: STORE_NAME,
    },
  ) as StateCreator<StoreState>,
)
