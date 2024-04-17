import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { StudentUseCasesImpl } from '../../domain/usecases/StudentServices'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { StudentModel } from '../../data/models/StudentModel'
import { useStudentStore } from '../state/studentStore'
import { IStudent } from '../../domain/entities/IStudent'
import { enqueueSnackbar } from 'notistack'
import { IStudentFilters } from '../../domain/entities/IStudentFilters'

export const useStudentCommands = () => {
  const { students } = useStudentStore()
  const { loader, addLoaderItem, removeLoaderItem } = useLoaderStore()

  const fetchData = async (rowsPerPage: number, currentPage: number) => {
    return await StudentUseCasesImpl.getInstance().getAll(
      rowsPerPage,
      currentPage * rowsPerPage,
    )
  }

  const updateRow = async (student: Partial<StudentModel>) => {
    return await StudentUseCasesImpl.getInstance().update(
      student.id as number,
      {
        isActive: !student.isActive,
      },
    )
  }

  const updateRows = async (students: Partial<StudentModel>[]) => {
    return await StudentUseCasesImpl.getInstance().bulkUpdate(students)

  }

  const fetchDataByField = async (
    filters: IStudentFilters,
    rowsPerPage: number,
    currentPage: number,
  ) => {
    return await StudentUseCasesImpl.getInstance().getByFilters(
      filters,
      rowsPerPage,
      currentPage * rowsPerPage,
    )
  }

  const bulkCreate = async (students: IStudent[]) => {
    return await StudentUseCasesImpl.getInstance().bulkCreate(students)
  }

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
