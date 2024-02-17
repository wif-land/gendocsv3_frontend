import { useEffect } from 'react'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { useStudentStore } from '../state/studentStore'

export const useStudentView = () => {
  const { students, setStudents, get } = useStudentStore()
  const { loader } = useLoaderStore()

  useEffect(() => {
    get()
  }, [])

  return {
    loader,
    students,
    setStudents,
  }
}
