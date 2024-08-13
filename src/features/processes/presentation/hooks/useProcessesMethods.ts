import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { useProcessStore } from '../state/useProcessStore'
import { ProcessesUseCasesImpl } from '../../domain/usecases/ProcessServices'
import { IProcess } from '../../domain/entities/IProcess'
import { IProcessFilters } from '../../domain/entities/IProcessFilters'
import { PaginationDTO } from '../../../../shared/utils/pagination-dto'

export const useProcessesMethods = () => {
  const { processes, setProcesses } = useProcessStore()
  const { loader } = useLoaderStore()

  const fetchData = async (
    moduleId: number,
    rowsPerPage: number,
    currentPage: number,
  ) =>
    await ProcessesUseCasesImpl.getInstance().getAllProcessesByModuleId(
      moduleId,
      new PaginationDTO(
        (currentPage * rowsPerPage) / rowsPerPage + 1,
        rowsPerPage,
      ),
    )

  const updateRow = async (process: Partial<IProcess>) =>
    await ProcessesUseCasesImpl.getInstance().update(process.id as number, {
      isActive: !process.isActive,
    })

  const fetchDataByField = async (
    filters: IProcessFilters,
    moduleId: number,
    rowsPerPage: number,
    currentPage: number,
  ) =>
    await ProcessesUseCasesImpl.getInstance().getByFilters(
      filters,
      moduleId,
      new PaginationDTO(
        (currentPage * rowsPerPage) / rowsPerPage + 1,
        rowsPerPage,
      ),
    )

  return {
    loader,
    processes,
    setProcesses,
    fetchData,
    updateRow,
    fetchDataByField,
  }
}
