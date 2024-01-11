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

  getAllProcessesByModuleId(moduleId: number): Promise<{
    status: number
    processes: ProcessModel[]
  }>

  getById(id: number): Promise<{
    status: number
    process: ProcessModel
  }>

  update(process: Partial<IProcess>): Promise<{
    status: number
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

  async getAllProcessesByModuleId(
    moduleId: number,
  ): Promise<{ status: number; processes: ProcessModel[] }> {
    const result = await AxiosClient.get(API_ROUTES.PROCESSES.GET_ALL, {
      params: { moduleId },
    })

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, processes: [] as ProcessModel[] }
    }

    return { status, processes: data.content as ProcessModel[] }
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

  update = async (process: Partial<IProcess>) => {
    const { id, ...rest } = process

    const result = await AxiosClient.patch(
      API_ROUTES.PROCESSES.UPDATE.replace(':id', id?.toString() || ''),
      rest,
    )

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status }
    }

    return { status, process: data.content as ProcessModel }
  }

  getById = async (id: number) => {
    throw new Error(`Method not implemented.${id}`)
  }
}
