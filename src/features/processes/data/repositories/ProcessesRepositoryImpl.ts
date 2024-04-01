import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
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
    limit: number,
    offset: number,
  ) => await this.datasource.getAllProcessesByModuleId(moduleId, limit, offset)

  getAll = async () => await this.datasource.getAll()

  getByFilters = async (
    filters: IProcessFilters,
    moduleId: number,
    limit: number,
    offset: number,
  ) => await this.datasource.getByFilter(filters, moduleId, limit, offset)

  update = async (data: Partial<ProcessModel>) =>
    await this.datasource.update(data)

  create = async (processData: IProcess) => {
    try {
      const result = await this.datasource.create(processData)
      const { status } = result

      if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
        return { status, process: {} as ProcessModel }
      }

      return { status, process: result.process }
    } catch (error) {
      return { status: 500, process: {} as ProcessModel }
    }
  }

  bulkUpdate = async (processes: Partial<IProcess>[]) =>
    await this.datasource.bulkUpdate(processes)
}
