import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { StudentUseCasesImpl } from '../../domain/usecases/StudentServices'
import { StudentModel } from '../../data/models/StudentModel'
import { PaginationDTO } from '../../../../shared/utils/pagination-dto'

interface StoreState {
  students: StudentModel[]
  setStudents: (students?: StudentModel[] | undefined) => void
  get: (pagination: PaginationDTO) => void
  getById: (id: number) => Promise<StudentModel>
  getByFilter: (field: string) => Promise<void>
}

const STORE_NAME = 'students-store'
const DEFAULT_STUDENTS: StudentModel[] = []

export const useStudentStore = create<StoreState>(
  persist(
    (set) => ({
      students: DEFAULT_STUDENTS,
      setStudents: (students) => set({ students }),
      get: async (pagination: PaginationDTO) => {
        const result =
          await StudentUseCasesImpl.getInstance().getAll(pagination)
        set({ students: result.students })
      },
      getByFilter: async (field) => {
        await StudentUseCasesImpl.getInstance()
          .getByFilters({ field }, new PaginationDTO())
          .then((res) => {
            set({ students: res.students })
          })
      },
      getById: async (id: number) => {
        const result = await StudentUseCasesImpl.getInstance().getById(id)
        set({ students: [result] })

        return result
      },
    }),
    {
      name: STORE_NAME,
      storage: createJSONStorage(() => sessionStorage),
    },
  ) as StateCreator<StoreState>,
)
