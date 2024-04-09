import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { ICareer } from '../../domain/entities/ICareer'
import { CareersUseCasesImpl } from '../../domain/usecases/CareerServices'
import { enqueueSnackbar } from 'notistack'

interface StoreState {
  careers: ICareer[]
  setCareers: (careers?: ICareer[]) => void
  addCareer: (career: ICareer) => void
  updateCareer: (career: Partial<ICareer>) => void
  get: () => void
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
      get: async () => {
        const result = await CareersUseCasesImpl.getInstance().getAll()
        if (!result) {
          enqueueSnackbar('Error al obtener las carreras', { variant: 'error' })
          return
        }
        set({ careers: result.careers })
      },
    }),
    {
      name: STORE_NAME,
      storage: createJSONStorage(() => sessionStorage),
    },
  ) as StateCreator<StoreState>,
)
