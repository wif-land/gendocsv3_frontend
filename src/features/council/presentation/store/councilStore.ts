import { create } from 'zustand'
import { CouncilModel } from '../../data/models/CouncilModel'
import { CouncilsUseCasesImpl } from '../../domain/usecases/CouncilServices'

interface StoreState {
  council: CouncilModel
  setCouncil: (data: CouncilModel) => void
  getCouncil: (id: number) => Promise<void>
}

const DEFAULT_COUNCILS: CouncilModel = CouncilModel.fromJson({})

export const useCouncilStore = create<StoreState>((set) => ({
  council: DEFAULT_COUNCILS,
  setCouncil: (data) => set({ council: data }),
  getCouncil: async (id) => {
    await CouncilsUseCasesImpl.getInstance()
      .getById(id)
      .then((data) => {
        set({ council: data })
      })
  },
}))
