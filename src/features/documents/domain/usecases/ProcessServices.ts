import { ProcessModel } from '../../data/models/ProcessesModel'
import { ProcessesRepositoryImpl } from '../../data/repositories/ProcessesRepositoryImpl'
import { IDocument } from '../entities/IProcess'
import { ProcessesRepository } from '../repositories/ProcessesRepository'

interface ProcessUseCases {
  create(process: IDocument): Promise<{
    status: number
    process: ProcessModel
  }>

  getAll(): Promise<{
    status: number
    processes: ProcessModel[]
  }>

  getById(id: number): Promise<{
    status: number
    process: ProcessModel
  }>

  update(
    id: number,
    process: Partial<ProcessModel>,
  ): Promise<{
    status: number
  }>

  getAllProcessesByModuleId(moduleId: number): Promise<{
    status: number
    processes: ProcessModel[]
  }>
}

export class ProcessesUseCasesImpl implements ProcessUseCases {
  static instance: ProcessesUseCasesImpl

  static getInstance = (): ProcessesUseCasesImpl => {
    if (!ProcessesUseCasesImpl.instance) {
      ProcessesUseCasesImpl.instance = new ProcessesUseCasesImpl()
    }

    return ProcessesUseCasesImpl.instance
  }

  private processRepository: ProcessesRepository =
    ProcessesRepositoryImpl.getInstance()

  create = async (process: IDocument) =>
    await this.processRepository.create(process)

  getAll = async () => await this.processRepository.getAll()

  getById = async (id: number) => {
    throw new Error(`Method not implemented.${id}`)
  }

  update = async (id: number, process: Partial<ProcessModel>) =>
    await this.processRepository.update({
      ...process,
      id,
    })

  getAllProcessesByModuleId = async (moduleId: number) =>
    await this.processRepository.getAllProcessesByModuleId(moduleId)
}
