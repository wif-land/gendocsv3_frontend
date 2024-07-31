import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { StudentUseCasesImpl } from '../../domain/usecases/StudentServices'
import { StudentModel } from '../../data/models/StudentModel'
import { useStudentStore } from '../state/studentStore'
import { IStudent } from '../../domain/entities/IStudent'
import { IStudentFilters } from '../../domain/entities/IStudentFilters'

export const useStudentCommands = () => {
  const { students } = useStudentStore()
  const { loader } = useLoaderStore()

  const fetchData = async (rowsPerPage: number, currentPage: number) =>
    await StudentUseCasesImpl.getInstance().getAll(
      rowsPerPage,
      currentPage * rowsPerPage,
    )

  const updateRow = async (student: Partial<StudentModel>) =>
    await StudentUseCasesImpl.getInstance().update(student.id as number, {
      isActive: !student.isActive,
    })

  const updateRows = async (students: Partial<StudentModel>[]) =>
    await StudentUseCasesImpl.getInstance().bulkUpdate(students, true, 1)

  const fetchDataByField = async (
    filters: IStudentFilters,
    rowsPerPage: number,
    currentPage: number,
  ) =>
    await StudentUseCasesImpl.getInstance().getByFilters(
      filters,
      rowsPerPage,
      currentPage * rowsPerPage,
    )

  const bulkCreate = async (
    students: IStudent[],
    isUpdate: boolean,
    userId: number,
  ) =>
    await StudentUseCasesImpl.getInstance().bulkUpdate(
      students,
      isUpdate,
      userId,
    )

  return {
    loader,
    students,
    fetchData,
    bulkCreate,
    updateRow,
    updateRows,
    fetchDataByField,
  }
}
