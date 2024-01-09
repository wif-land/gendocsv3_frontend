import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'
import { API_ROUTES } from '../../../shared/constants/appApiRoutes'
import { AxiosClient } from '../../../shared/utils/AxiosClient'
import { IProcess } from '../types/IProcess'

export class ProcessApi {
  static fetchProcesses = async (): Promise<{
    status: number
    message?: string
    processes?: IProcess[]
  }> => {
    const result = await AxiosClient.get(API_ROUTES.PROCESSES.GET_ALL)
    const { status, data } = result
    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, message: data?.message }
    }

    return { status, processes: data.content as IProcess[] }
  }

  static createProcess = async (
    body: Partial<IProcess>,
  ): Promise<{
    status: number
    process?: IProcess
    message?: string
  }> => {
    const result = await AxiosClient.post(API_ROUTES.PROCESSES.CREATE, body)
    const { status, data } = result
    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, message: data?.message }
    }
    return { status, process: data.content as IProcess }
  }

  static fetchProcessesByModule = async (
    moduleCode: string | string[],
  ): Promise<{
    status: number
    message?: string
    processes?: IProcess[]
  }> => {
    const result = await AxiosClient.get(
      `${API_ROUTES.PROCESSES.GET_BY_MODULE}${moduleCode}`,
    )

    const { status, data } = result
    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, message: data?.message }
    }

    return { status, processes: data.content as IProcess[] }
  }

  static updateProcess = async (
    id: number,
    body: Partial<IProcess>,
  ): Promise<{
    status: number
    process?: IProcess
    message?: string
  }> => {
    const result = await AxiosClient.patch(API_ROUTES.PROCESSES.UPDATE, body, {
      id,
    })
    const { status, data } = result
    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, message: data?.message }
    }
    return { status, process: data.content as IProcess }
  }
}
