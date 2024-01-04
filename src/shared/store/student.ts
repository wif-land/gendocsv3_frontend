import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { IStudent } from '../../features/students/types/IStudent'
import { StudentsApi } from '../../features/students/api/students'

interface StoreState {
  students: IStudent[] | undefined
  setStudents: (students?: IStudent[] | undefined) => void
  get: () => void
}

const STORE_NAME = 'students-store'
const DEFAULT_CAREERS: IStudent[] = []

export const useStudentStore = create<StoreState>(
  persist(
    (set) => ({
      students: undefined,
      setStudents: (careers) => set({ students: careers }),
      get: async () => {
        const result = await StudentsApi.fetchStudents()
        set({ students: result.students })
      },
    }),
    {
      name: STORE_NAME,
    },
  ) as StateCreator<StoreState>,
)
