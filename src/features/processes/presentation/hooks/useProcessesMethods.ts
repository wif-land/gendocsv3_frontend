import useLoaderStore from '../../../../shared/store/useLoaderStore'
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

      return response
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
    return await ProcessesUseCasesImpl.getInstance().update(
      process.id as number,
      {
        isActive: !process.isActive,
      },
    )
  }

  const fetchDataByField = async (
    filters: IProcessFilters,
    moduleId: number,
    rowsPerPage: number,
    currentPage: number,
  ) => {
    addLoaderItem('processes')
    return await ProcessesUseCasesImpl.getInstance().getByFilters(
      filters,
      moduleId,
      rowsPerPage,
      currentPage * rowsPerPage,
    )
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
