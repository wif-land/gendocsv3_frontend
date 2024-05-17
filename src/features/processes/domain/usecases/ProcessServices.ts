import { ProcessModel } from '../../data/models/ProcessesModel'
import { ProcessesRepositoryImpl } from '../../data/repositories/ProcessesRepositoryImpl'
import { IProcess } from '../entities/IProcess'
import { IProcessFilters } from '../entities/IProcessFilters'
import { ProcessesRepository } from '../repositories/ProcessesRepository'

interface ProcessUseCases {
  create(process: IProcess): Promise<{
    process: ProcessModel
  }>

  getAll(): Promise<{
    processes: ProcessModel[]
  }>

  getById(id: number): Promise<{
    process: ProcessModel
  }>

  getByFilters(
    filters: IProcessFilters,
    moduleId: number,
    limit: number,
    offset: number,
  ): Promise<{
    count: number
    processes: ProcessModel[]
  }>

  update(id: number, process: Partial<ProcessModel>): Promise<void>

  toggleProcessStatus(processes: Partial<IProcess>[]): Promise<{
    processes: ProcessModel[]
  }>

  getAllProcessesByModuleId(
    moduleId: number,
    limit: number,
    offset: number,
  ): Promise<{
    processes: ProcessModel[]
    count: number
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

  create = async (process: IProcess) =>
    await this.processRepository.create(process)

  getAll = async () => await this.processRepository.getAll()

  getById = async (id: number) => {
    throw new Error(`Method not implemented.${id}`)
  }

  getByFilters = async (
    filters: IProcessFilters,
    moduleId: number,
    limit = 5,
    offset = 0,
  ) =>
    await this.processRepository.getByFilters(filters, moduleId, limit, offset)

  update = async (id: number, process: Partial<ProcessModel>) => {
    await this.processRepository.update({
      ...process,
      id,
    })
  }

  getAllProcessesByModuleId = async (
    moduleId: number,
    limit: number,
    offset: number,
  ) =>
    await this.processRepository.getAllProcessesByModuleId(
      moduleId,
      limit,
      offset,
    )

  toggleProcessStatus = async (processes: Partial<IProcess>[]) =>
    await this.processRepository.bulkUpdate(processes)
}
