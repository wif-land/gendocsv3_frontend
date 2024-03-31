import { ProcessModel } from '../models/ProcessesModel'
import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { IProcess } from '../../domain/entities/IProcess'

export interface ProcessesDataSource {
  getAll(): Promise<{
    status: number
    processes: ProcessModel[]
  }>

  getAllProcessesByModuleId(
    moduleId: number,
    limit: number,
    offset: number,
  ): Promise<{
    status: number
    data: {
      processes: ProcessModel[]
      count: number
    }
  }>

  getByField(
    field: string,
    moduleId: number,
    limit: number,
    offset: number,
  ): Promise<{
    status: number
    data: {
      processes: ProcessModel[]
      count: number
    }
  }>

  getById(id: number): Promise<{
    status: number
    process: ProcessModel
  }>

  update(process: Partial<IProcess>): Promise<{
    status: number
    process: ProcessModel
  }>

  bulkUpdate(processes: Partial<IProcess>[]): Promise<{
    status: number
    processes: ProcessModel[]
  }>

  create(process: IProcess): Promise<{
    status: number
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
    const result = await AxiosClient.get(API_ROUTES.PROCESSES.GET_ALL, {
      params: { moduleId, limit, offset },
    })

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.OK) {
      return {
        status,
        data: data.content as { processes: ProcessModel[]; count: number },
      }
    }

    return { status, data: { processes: [], count: 0 } }
  }

  create = async (process: ProcessModel) => {
    const result = await AxiosClient.post(API_ROUTES.PROCESSES.CREATE, process)

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, process: {} as ProcessModel }
    }

    return { status, process: data.content as ProcessModel }
  }

  getAll = async () => {
    const result = await AxiosClient.get(API_ROUTES.PROCESSES.GET_ALL)

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, processes: [] as ProcessModel[] }
    }

    return { status, processes: data.content as ProcessModel[] }
  }

  getByField = async (
    field: string,
    moduleId: number,
    limit: number,
    offset: number,
  ) => {
    const result = await AxiosClient.get(
      API_ROUTES.PROCESSES.GET_BY_FIELD(field),
      {
        params: { moduleId, limit, offset },
      },
    )

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.OK) {
      return {
        status,
        data: data.content as { processes: ProcessModel[]; count: number },
      }
    }
    return { status, data: { processes: [], count: 0 } }
  }

  update = async (process: Partial<IProcess>) => {
    const { id, ...rest } = process

    const result = await AxiosClient.patch(
      API_ROUTES.PROCESSES.UPDATE.replace(':id', id?.toString() || ''),
      rest,
    )

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.OK) {
      return { status, process: data.content as ProcessModel }
    }

    return { status, process: {} as ProcessModel }
  }

  bulkUpdate = async (processes: IProcess[]) => {
    const result = AxiosClient.patch(API_ROUTES.COUNCILS.BULK_UPDATE, processes)

    return result.then(({ status, data }) => {
      if (status === HTTP_STATUS_CODES.OK) {
        return { status, processes: data.content as ProcessModel[] }
      }
      return { status, processes: [] as ProcessModel[] }
    })
  }

  getById = async (id: number) => {
    throw new Error(`Method not implemented.${id}`)
  }
}
