import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { DegCerGradesModel } from '../../data/models/DegCerGradesModel'

interface StoreState {
  degCerGrades: DegCerGradesModel[]
  setDegCerGrades: (degCerGrades: DegCerGradesModel[]) => void
  addDegCerGrades: (degCerGrade: DegCerGradesModel) => void
  removeDegCerGrades: (degCerGradeId: number) => void
}

const STORE_NAME = 'degree-certificates-grades-store'

const DEFAULT_DEGREE_CERTIFICATES_TEMPLATES: DegCerGradesModel[] = []

export const useDegCerGradesStore = create<StoreState>(
  persist(
    (set) => ({
      degCerGrades: DEFAULT_DEGREE_CERTIFICATES_TEMPLATES,
      setDegCerGrades: (degCerGrades) => set({ degCerGrades }),
      addDegCerGrades: (degCerGrade) =>
        set((state) => ({
          degCerGrades: [...state.degCerGrades, degCerGrade],
        })),
      removeDegCerGrades: (degCerGradeId) =>
        set((state) => ({
          degCerGrades: state.degCerGrades.filter(
            (degCerGrade) => degCerGrade.id !== degCerGradeId,
          ),
        })),
    }),
    {
      name: STORE_NAME,
    },
  ) as StateCreator<StoreState>,
)
