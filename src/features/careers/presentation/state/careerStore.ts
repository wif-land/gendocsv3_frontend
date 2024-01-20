import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { ICareer } from '../../domain/entities/ICareer'

interface StoreState {
  careers: ICareer[]
  setCareers: (careers?: ICareer[] | undefined) => void
  addCareer: (career: ICareer) => void
  updateCareer: (career: Partial<ICareer>) => void
}

const STORE_NAME = 'careers-store'
const DEFAULT_CAREERS: ICareer[] = []

export const useCareersStore = create<StoreState>(
  persist(
    (set) => ({
      careers: DEFAULT_CAREERS,
      setCareers: (careers) => set({ careers }),
      addCareer: (career) =>
        set((state) => ({
          careers: [...state.careers, career],
        })),
      updateCareer: (career) =>
        set((state) => ({
          careers: state.careers.map((currentCareer) =>
            currentCareer.id === career.id
              ? { ...currentCareer, ...career }
              : currentCareer,
          ),
        })),
    }),
    {
      name: STORE_NAME,
      storage: createJSONStorage(() => sessionStorage),
    },
  ) as StateCreator<StoreState>,
)
