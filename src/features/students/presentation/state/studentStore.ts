import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { IStudent } from '../../domain/entities/IStudent'
import { StudentUseCasesImpl } from '../../domain/usecases/StudentServices'

interface StoreState {
  students: IStudent[] | undefined
  setStudents: (students?: IStudent[] | undefined) => void
  get: () => void
}

const STORE_NAME = 'students-store'
export const useStudentStore = create<StoreState>(
  persist(
    (set) => ({
      students: undefined,
      setStudents: (careers) => set({ students: careers }),
      get: async () => {
        const result = await StudentUseCasesImpl.getInstance().getAll()
        set({ students: result.students })
      },
    }),
    {
      name: STORE_NAME,
      storage: createJSONStorage(() => sessionStorage),
    },
  ) as StateCreator<StoreState>,
)
