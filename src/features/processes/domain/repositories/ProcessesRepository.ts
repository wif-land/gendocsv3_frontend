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
    limit: number,
    offset: number,
  ) => Promise<{
    count: number
    processes: ProcessModel[]
  }>

  update: (data: Partial<IProcess>) => Promise<{
    process: ProcessModel
  }>

  create: (processData: IProcess) => Promise<{
    process: ProcessModel
  }>

  getAllProcessesByModuleId(
    moduleId: number,
    limit: number,
    offset: number,
  ): Promise<{
    processes: ProcessModel[]
    count: number
  }>

  bulkUpdate: (processes: Partial<IProcess>[]) => Promise<{
    processes: ProcessModel[]
  }>
}
