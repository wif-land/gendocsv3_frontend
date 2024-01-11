import { ProcessModel } from '../../data/models/ProcessesModel'
import { IProcess } from '../entities/IProcess'

export interface ProcessesRepository {
  getAll: () => Promise<{
    status: number
    processes: ProcessModel[]
  }>

  update: (data: Partial<IProcess>) => Promise<{
    status: number
  }>

  create: (processData: IProcess) => Promise<{
    status: number
    process: ProcessModel
  }>

  getAllProcessesByModuleId: (moduleId: number) => Promise<{
    status: number
    processes: ProcessModel[]
  }>
}
