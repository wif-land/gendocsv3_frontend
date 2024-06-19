import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { ICareer, IUpdateCareer } from '../../domain/entities/ICareer'
import { CareersUseCasesImpl } from '../../domain/usecases/CareerServices'

interface StoreState {
  careers: ICareer[]
  setCareers: (careers?: ICareer[]) => void
  addCareer: (career: ICareer) => void
  updateCareer: (career: IUpdateCareer) => void
  get: () => Promise<ICareer[]>
}

const STORE_NAME = 'careers-store'
const DEFAULT_CAREERS: ICareer[] = []

export const useCareersStore = create<StoreState>(
  persist(
    (set, getState) => ({
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
              ? {
                  ...currentCareer,
                  ...career,
                  coordinator: getState().careers.find(
                    (c) => c.id === career.id,
                  )!.coordinator,
                }
              : currentCareer,
          ),
        })),
      get: async () => {
        const result = await CareersUseCasesImpl.getInstance().getAll()
        set({ careers: result || [] })

        return result
      },
    }),
    {
      name: STORE_NAME,
      storage: createJSONStorage(() => sessionStorage),
    },
  ) as StateCreator<StoreState>,
)
