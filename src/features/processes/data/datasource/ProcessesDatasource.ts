import { ProcessModel } from '../models/ProcessesModel'
import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { IProcess } from '../../domain/entities/IProcess'
import { IProcessFilters } from '../../domain/entities/IProcessFilters'

export interface ProcessesDataSource {
  getAll(): Promise<{
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

  getByFilter(
    filters: IProcessFilters,
    moduleId: number,
    limit: number,
    offset: number,
  ): Promise<{
    processes: ProcessModel[]
    count: number
  }>

  update(process: Partial<IProcess>): Promise<{
    process: ProcessModel
  }>

  bulkUpdate(processes: Partial<IProcess>[]): Promise<{
    processes: ProcessModel[]
  }>

  create(process: IProcess): Promise<{
    process: ProcessModel
  }>
}

export class ProcessesDataSourceImpl implements ProcessesDataSource {
  static instance: ProcessesDataSourceImpl

  static getInstance = (): ProcessesDataSourceImpl => {
    if (!ProcessesDataSourceImpl.instance) {
      ProcessesDataSourceImpl.instance = new ProcessesDataSourceImpl()
    }

    return ProcessesDataSourceImpl.instance
  }

  getAllProcessesByModuleId = async (
    moduleId: number,
    limit: number,
    offset: number,
  ) => {
    const result = await AxiosClient.get(API_ROUTES.PROCESSES.GET_BY_MODULE, {
      params: { moduleId, limit, offset },
    })

    if ('error' in result) {
      return {
        processes: [],
        count: 0,
      }
    }

    const { data } = result

    return data as { processes: ProcessModel[]; count: number }
  }

  create = async (process: ProcessModel) => {
    const result = await AxiosClient.post(API_ROUTES.PROCESSES.CREATE, process)

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        process: {} as ProcessModel,
      }
    }

    return result.data as { process: ProcessModel }
  }

  getAll = async () => {
    const result = await AxiosClient.get(API_ROUTES.PROCESSES.GET_ALL)

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        processes: [] as ProcessModel[],
      }
    }

    return result.data as { processes: ProcessModel[] }
  }

  getByFilter = async (
    filters: IProcessFilters,
    moduleId: number,
    limit: number,
    offset: number,
  ) => {
    const result = await AxiosClient.get(API_ROUTES.PROCESSES.GET_BY_FILTERS, {
      params: { ...filters, moduleId, limit, offset },
    })

    if ('error' in result) {
      return {
        processes: [] as ProcessModel[],
        count: 0,
      }
    }

    const { data } = result

    return data as { processes: ProcessModel[]; count: number }
  }

  update = async (process: Partial<IProcess>) => {
    const { id, ...rest } = process

    const result = await AxiosClient.patch(
      API_ROUTES.PROCESSES.UPDATE.replace(':id', id?.toString() || ''),
      rest,
    )

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        process: {} as ProcessModel,
      }
    }

    return result.data as { process: ProcessModel }
  }

  bulkUpdate = async (processes: IProcess[]) => {
    const result = await AxiosClient.patch(
      API_ROUTES.COUNCILS.BULK_UPDATE,
      processes,
    )

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        processes: [] as ProcessModel[],
      }
    }

    return result.data as { processes: ProcessModel[] }
  }
}
