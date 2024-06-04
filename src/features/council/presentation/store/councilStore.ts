import { create } from 'zustand'
import { CouncilModel } from '../../data/models/CouncilModel'

interface StoreState {
  council: CouncilModel
  setCouncil: (data: CouncilModel) => void
}

const DEFAULT_COUNCILS: CouncilModel = CouncilModel.fromJson({})

export const useCouncilStore = create<StoreState>((set) => ({
  council: DEFAULT_COUNCILS,
  setCouncil: (data) => set({ council: data }),
}))
