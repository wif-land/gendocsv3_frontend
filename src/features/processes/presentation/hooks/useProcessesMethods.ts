import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { enqueueSnackbar } from 'notistack'
import { useProcessStore } from '../state/useProcessStore'
import { ProcessesUseCasesImpl } from '../../domain/usecases/ProcessServices'
import { IProcess } from '../../domain/entities/IProcess'
import { IProcessFilters } from '../../domain/entities/IProcessFilters'

export const useProcessesMethods = () => {
  const { processes, setProcesses } = useProcessStore()
  const { loader, addLoaderItem, removeLoaderItem } = useLoaderStore()

  const fetchData = async (
    moduleId: number,
    rowsPerPage: number,
    currentPage: number,
  ) => {
    addLoaderItem('processes')
    try {
      const response =
        await ProcessesUseCasesImpl.getInstance().getAllProcessesByModuleId(
          moduleId,
          rowsPerPage,
          currentPage * rowsPerPage,
        )

      if (response.status !== HTTP_STATUS_CODES.OK) {
        return {
          processes: [],
          count: 0,
        }
      }

      return response.data
    } catch (error) {
      enqueueSnackbar('No encontramos consejos', {
        variant: 'info',
      })
      return {
        processes: [],
        count: 0,
      }
    } finally {
      removeLoaderItem('processes')
    }
  }

  const updateRow = async (process: Partial<IProcess>) => {
    addLoaderItem('processes')
    try {
      const response = await ProcessesUseCasesImpl.getInstance().update(
        process.id as number,
        {
          isActive: !process.isActive,
        },
      )
      if (response.status === HTTP_STATUS_CODES.OK) {
        return response.process as IProcess
      }
    } catch (error) {
      return null
    } finally {
      removeLoaderItem('processes')
    }
  }

  const fetchDataByField = async (
    filters: IProcessFilters,
    moduleId: number,
    rowsPerPage: number,
    currentPage: number,
  ) => {
    addLoaderItem('processes')
    try {
      const response = await ProcessesUseCasesImpl.getInstance().getByFilters(
        filters,
        moduleId,
        rowsPerPage,
        currentPage * rowsPerPage,
      )
      if (
        response.status === HTTP_STATUS_CODES.OK ||
        response.status === HTTP_STATUS_CODES.NOT_FOUND
      ) {
        return response as {
          status: number
          data: { count: number; processes: IProcess[] }
        }
      }
    } catch (error) {
      return {
        status: 500,
        data: {
          count: 0,
          processes: [],
        },
      }
    } finally {
      removeLoaderItem('processes')
    }
  }

  return {
    loader,
    processes,
    setProcesses,
    fetchData,
    updateRow,
    fetchDataByField,
  }
}
