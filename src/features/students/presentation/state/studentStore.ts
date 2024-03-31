import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { StudentUseCasesImpl } from '../../domain/usecases/StudentServices'
import { StudentModel } from '../../data/models/StudentModel'

interface StoreState {
  students: StudentModel[]
  setStudents: (students?: StudentModel[] | undefined) => void
  get: (limit: number, offset: number) => void
}

const STORE_NAME = 'students-store'
const DEFAULT_STUDENTS: StudentModel[] = []

export const useStudentStore = create<StoreState>(
  persist(
    (set) => ({
      students: DEFAULT_STUDENTS,
      setStudents: (students) => set({ students }),
      get: async (limit: number, offset: number) => {
        const result = await StudentUseCasesImpl.getInstance().getAll(
          limit,
          offset,
        )
        set({ students: result.data.students })
      },
    }),
    {
      name: STORE_NAME,
      storage: createJSONStorage(() => sessionStorage),
    },
  ) as StateCreator<StoreState>,
)
