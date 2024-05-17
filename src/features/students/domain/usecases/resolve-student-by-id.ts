'use client'

import { StudentModel } from '../../data/models/StudentModel'
import { useStudentStore } from '../../presentation/state/studentStore'

export const resolveStudentById = async (id: number): Promise<StudentModel> => {
  const { students } = useStudentStore()

  return students.find((student) => student.id === id) as StudentModel
}
