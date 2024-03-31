import { ProcessModel } from '../../data/models/ProcessesModel'
import { IProcess } from '../entities/IProcess'

export interface ProcessesRepository {
  getAll: () => Promise<{
    status: number
    processes: ProcessModel[]
  }>

  getByField: (
    field: string,
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

  getAllProcessesByModuleId: (
    moduleId: number,
    limit: number,
    offset: number,
  ) => Promise<{
    status: number
    data: {
      processes: ProcessModel[]
      count: number
    }
  }>

  bulkUpdate: (processes: Partial<IProcess>[]) => Promise<{
    status: number
    processes: ProcessModel[]
  }>
}
