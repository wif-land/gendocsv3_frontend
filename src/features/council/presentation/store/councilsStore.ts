import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { CouncilModel } from '../../data/models/CouncilModel'
import { CouncilsUseCasesImpl } from '../../domain/usecases/CouncilServices'
import { ICouncilFormValues } from '../../domain/entities/ICouncil'

interface StoreState {
  councils: CouncilModel[]
  setCouncils: (careers: CouncilModel[]) => void
  addCouncil: (career: CouncilModel) => void
  getCouncils: () => Promise<void>
  createCouncil: (career: ICouncilFormValues) => Promise<CouncilModel>
  updateCouncil: (career: ICouncilFormValues) => Promise<CouncilModel>
}

const STORE_NAME = 'councils-store'
const DEFAULT_COUNCILS: CouncilModel[] = []

export const useCouncilsStore = create<StoreState>(
  persist(
    (set) => ({
      councils: DEFAULT_COUNCILS,
      setCouncils: (councils) => set({ councils }),
      addCouncil: (council: CouncilModel) =>
        set((state) => ({ councils: [...state.councils, council] })),
      getCouncils: async () => {
        set({ councils: await CouncilsUseCasesImpl.getInstance().getAll() })
      },
      createCouncil: async (council) => {
        const newCouncil =
          await CouncilsUseCasesImpl.getInstance().create(council)
        set((state) => ({ councils: [...state.councils, newCouncil] }))
        return newCouncil
      },
      updateCouncil: async (council) => {
        const updatedCouncil = await CouncilsUseCasesImpl.getInstance().update(
          council.id!,
          council,
        )
        set((state) => ({
          councils: state.councils.map((c) =>
            c.id === updatedCouncil.id ? updatedCouncil : c,
          ),
        }))
        return updatedCouncil
      },
    }),
    {
      name: STORE_NAME,
    },
  ) as StateCreator<StoreState>,
)
