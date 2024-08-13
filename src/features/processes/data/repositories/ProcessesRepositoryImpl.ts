import { PaginationDTO } from '../../../../shared/utils/pagination-dto'
import { IProcess } from '../../domain/entities/IProcess'
import { IProcessFilters } from '../../domain/entities/IProcessFilters'
import { ProcessesRepository } from '../../domain/repositories/ProcessesRepository'
import {
  ProcessesDataSource,
  ProcessesDataSourceImpl,
} from '../datasource/ProcessesDatasource'
import { ProcessModel } from '../models/ProcessesModel'

export class ProcessesRepositoryImpl implements ProcessesRepository {
  static instance: ProcessesRepositoryImpl

  static getInstance = (): ProcessesRepositoryImpl => {
    if (!ProcessesRepositoryImpl.instance) {
      ProcessesRepositoryImpl.instance = new ProcessesRepositoryImpl(
        ProcessesDataSourceImpl.getInstance(),
      )
    }

    return ProcessesRepositoryImpl.instance
  }

  private constructor(private readonly datasource: ProcessesDataSource) {}

  getAllProcessesByModuleId = async (
    moduleId: number,
    pagination?: PaginationDTO,
  ) => await this.datasource.getAllProcessesByModuleId(moduleId, pagination)

  getAll = async () => await this.datasource.getAll()

  getByFilters = async (
    filters: IProcessFilters,
    moduleId: number,
    pagination?: PaginationDTO,
  ) => await this.datasource.getByFilter(filters, moduleId, pagination)

  update = async (data: Partial<ProcessModel>) =>
    await this.datasource.update(data)

  create = async (processData: IProcess) =>
    await this.datasource.create(processData)

  bulkUpdate = async (processes: Partial<IProcess>[]) =>
    await this.datasource.bulkUpdate(processes)
}
