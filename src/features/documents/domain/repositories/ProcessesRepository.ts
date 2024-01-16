import { ProcessModel } from '../../data/models/ProcessesModel'
import { IDocument } from '../entities/IProcess'

export interface ProcessesRepository {
  getAll: () => Promise<{
    status: number
    processes: ProcessModel[]
  }>

  update: (data: Partial<IDocument>) => Promise<{
    status: number
  }>

  create: (processData: IDocument) => Promise<{
    status: number
    process: ProcessModel
  }>

  getAllProcessesByModuleId: (moduleId: number) => Promise<{
    status: number
    processes: ProcessModel[]
  }>
}
