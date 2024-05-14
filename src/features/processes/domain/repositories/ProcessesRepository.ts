import { ProcessModel } from '../../data/models/ProcessesModel'
import { IProcess } from '../entities/IProcess'
import { IProcessFilters } from '../entities/IProcessFilters'

export interface ProcessesRepository {
  getAll: () => Promise<{
    status: number
    processes: ProcessModel[]
  }>

  getByFilters: (
    filters: IProcessFilters,
    moduleId: number,
    limit: number,
    offset: number,
  ) => Promise<{
    status: number
    data: {
      count: number
      processes: ProcessModel[]
    }
  }>

  update: (data: Partial<IProcess>) => Promise<{
    status: number
    process: ProcessModel
  }>

  create: (processData: IProcess) => Promise<{
    status: number
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
    status: number
    processes: ProcessModel[]
  }>
}
