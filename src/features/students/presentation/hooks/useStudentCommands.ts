import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { StudentUseCasesImpl } from '../../domain/usecases/StudentServices'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { StudentModel } from '../../data/models/StudentModel'
import { useStudentStore } from '../state/studentStore'
import { IStudent } from '../../domain/entities/IStudent'
import { enqueueSnackbar } from 'notistack'

export const useStudentCommands = () => {
  const { students } = useStudentStore()
  const { loader, addLoaderItem, removeLoaderItem } = useLoaderStore()

  const fetchData = async (rowsPerPage: number, currentPage: number) => {
    addLoaderItem('students')
    try {
      const response = await StudentUseCasesImpl.getInstance().getAll(
        rowsPerPage,
        currentPage * rowsPerPage,
      )
      if (response.status === HTTP_STATUS_CODES.OK) {
        return response.data as {
          students: StudentModel[]
          count: number
        }
      }
    } catch (error) {
      return {
        students: [],
        count: 0,
      }
    } finally {
      removeLoaderItem('students')
    }
  }

  const updateRow = async (student: Partial<StudentModel>) => {
    addLoaderItem('students')
    try {
      const response = await StudentUseCasesImpl.getInstance().update(
        student.id as number,
        {
          isActive: !student.isActive,
        },
      )
      if (response.status === HTTP_STATUS_CODES.OK) {
        return response.student as StudentModel
      }
    } catch (error) {
      return null
    } finally {
      removeLoaderItem('students')
    }
  }

  const updateRows = async (students: Partial<StudentModel>[]) => {
    addLoaderItem('students')
    try {
      const response =
        await StudentUseCasesImpl.getInstance().bulkUpdate(students)
      if (response.status === HTTP_STATUS_CODES.OK) {
        return response.students as StudentModel[]
      }
    } catch (error) {
      return []
    } finally {
      removeLoaderItem('students')
    }
  }

  const fetchDataByField = async (
    searchTerm: string,
    rowsPerPage: number,
    currentPage: number,
  ) => {
    addLoaderItem('students')
    try {
      const response = await StudentUseCasesImpl.getInstance().getByField(
        searchTerm,
        rowsPerPage,
        currentPage * rowsPerPage,
      )
      if (
        response.status === HTTP_STATUS_CODES.OK ||
        response.status === HTTP_STATUS_CODES.NOT_FOUND
      ) {
        return response as {
          status: number
          data: { count: number; students: StudentModel[] }
        }
      }
    } catch (error) {
      return {
        status: 500,
        data: {
          count: 0,
          students: [],
        },
      }
    } finally {
      removeLoaderItem('students')
    }
  }

  const bulkCreate = async (students: IStudent[]) => {
    addLoaderItem('students')
    try {
      const response =
        await StudentUseCasesImpl.getInstance().bulkCreate(students)
      if (response.status !== HTTP_STATUS_CODES.CREATED) {
        enqueueSnackbar('Error al cargar los estudiantes', { variant: 'error' })
        return
      }

      enqueueSnackbar('Estudiantes cargados con éxito', { variant: 'success' })
      return response.students as StudentModel[]
    } finally {
      removeLoaderItem('students')
    }
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
