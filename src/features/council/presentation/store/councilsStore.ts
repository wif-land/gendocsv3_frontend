import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { CouncilModel } from '../../data/models/CouncilModel'
import { CouncilsUseCasesImpl } from '../../domain/usecases/CouncilServices'
import { ICouncil, ICouncilFormValues } from '../../domain/entities/ICouncil'
import { PaginationDTO } from '../../../../shared/utils/pagination-dto'

interface StoreState {
  councils: CouncilModel[]
  setCouncils: (careers: CouncilModel[]) => void
  addCouncil: (career: CouncilModel) => void
  getCouncilsByModuleId: (
    moduleId: number,
    pagination?: PaginationDTO,
  ) => Promise<void>
  getById: (id: number) => Promise<CouncilModel>
  createCouncil: (career: ICouncilFormValues) => Promise<CouncilModel>
  updateCouncil: (
    career: ICouncilFormValues,
    councilToUpdate: ICouncil,
  ) => Promise<CouncilModel>
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
      getCouncilsByModuleId: async (moduleId, pagination) => {
        await CouncilsUseCasesImpl.getInstance()
          .getAllCouncilsByModuleId(moduleId, pagination)
          .then((data) => set({ councils: data.councils }))
      },
      createCouncil: async (council) => {
        const newCouncil =
          await CouncilsUseCasesImpl.getInstance().create(council)
        set((state) => ({ councils: [...state.councils, newCouncil] }))
        return newCouncil
      },
      updateCouncil: async (council, councilToUpdate) => {
        const updatedCouncil = await CouncilsUseCasesImpl.getInstance().update(
          council.id!,
          council,
          councilToUpdate,
        )
        set((state) => ({
          councils: state.councils.map((c) =>
            c.id === updatedCouncil.id ? updatedCouncil : c,
          ),
        }))
        return updatedCouncil
      },
      getById: async (id) =>
        await CouncilsUseCasesImpl.getInstance().getById(id),
    }),
    {
      name: STORE_NAME,
    },
  ) as StateCreator<StoreState>,
)
