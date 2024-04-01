import { ProcessModel } from '../../data/models/ProcessesModel'
// eslint-disable-next-line import/namespace
import { ProcessesRepositoryImpl } from '../../data/repositories/ProcessesRepositoryImpl'
import { IProcess } from '../entities/IProcess'
import { ProcessesRepository } from '../repositories/ProcessesRepository'

interface ProcessUseCases {
  create(process: IProcess): Promise<{
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

  getByField(
    field: string,
    moduleId: number,
    limit: number,
    offset: number,
  ): Promise<{
    status: number
    data: {
      count: number
      processes: ProcessModel[]
    }
  }>

  update(
    id: number,
    process: Partial<ProcessModel>,
  ): Promise<{
    status: number
  }>

  toggleProcessStatus(processes: Partial<IProcess>[]): Promise<{
    status: number
    processes: ProcessModel[]
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

  getByField = async (field: string, moduleId: number, limit = 5, offset = 0) =>
    await this.processRepository.getByField(field, moduleId, limit, offset)

  update = async (id: number, process: Partial<ProcessModel>) =>
    await this.processRepository.update({
      ...process,
      id,
    })

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
