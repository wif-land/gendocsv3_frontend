import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { IStudent } from '../../domain/entities/IStudent'
import { StudentUseCasesImpl } from '../../domain/usecases/StudentServices'

interface StoreState {
  students: IStudent[]
  setStudents: (students?: IStudent[] | undefined) => void
  get: (limit: number, offset: number) => void
}

const STORE_NAME = 'students-store'
const DEFAULT_STUDENTS: IStudent[] = []

export const useStudentStore = create<StoreState>(
  persist(
    (set) => ({
      students: DEFAULT_STUDENTS,
      setStudents: (careers) => set({ students: careers }),
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
