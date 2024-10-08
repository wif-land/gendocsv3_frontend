import { PaginationDTO } from '../../../../shared/utils/pagination-dto'
import { ProcessModel } from '../../data/models/ProcessesModel'
import { IProcess } from '../entities/IProcess'
import { IProcessFilters } from '../entities/IProcessFilters'

export interface ProcessesRepository {
  getAll: () => Promise<{
    processes: ProcessModel[]
  }>

  getByFilters: (
    filters: IProcessFilters,
    moduleId: number,
    pagination?: PaginationDTO,
  ) => Promise<{
    count: number
    processes: ProcessModel[]
  }>

  update: (data: Partial<IProcess>) => Promise<ProcessModel>

  create: (processData: IProcess) => Promise<ProcessModel>

  getAllProcessesByModuleId(
    moduleId: number,
    pagination?: PaginationDTO,
  ): Promise<{
    processes: ProcessModel[]
    count: number
  }>

  bulkUpdate: (processes: Partial<IProcess>[]) => Promise<{
    processes: ProcessModel[]
  }>
}
