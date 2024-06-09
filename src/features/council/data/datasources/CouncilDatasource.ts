import { CouncilModel } from '../models/CouncilModel'
import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import {
  ICouncil,
  ICreateCouncil,
  IUpdateCouncil,
} from '../../domain/entities/ICouncil'
import { ICouncilFilters } from '../../domain/entities/ICouncilFilters'
import { INotifyMembers } from '../../domain/entities/INotifyMembers'

export interface CouncilsDataSource {
  getAll(): Promise<CouncilModel[]>

  getAllCouncilsByModuleId(
    moduleId: number,
    limit: number,
    offset: number,
  ): Promise<{
    councils: CouncilModel[]
    count: number
  }>

  getByFilters(
    filters: ICouncilFilters,
    moduleId: number,
    limit: number,
    offset: number,
  ): Promise<{
    councils: CouncilModel[]
    count: number
  }>

  update(council: IUpdateCouncil): Promise<CouncilModel>

  create(council: ICreateCouncil): Promise<CouncilModel>

  bulkUpdate(councils: Partial<ICouncil>[]): Promise<CouncilModel[]>

  notifyMembers(payload: {
    members: INotifyMembers[]
    councilId: number
  }): Promise<void>

  getById(id: number): Promise<CouncilModel>

  getNextNumberAvailable(moduleId: number): Promise<number>

  getCouncilsThatCanReserve(moduleId: number): Promise<CouncilModel[]>

  reserveNumeration(payload: {
    councilId: number
    start?: number
    end?: number
    isExtension?: boolean
  }): Promise<void>

  getAvailableExtensionNumeration(councilId: number): Promise<{
    start: number
    end: number
    actualStart: number
    actualEnd: number
  }>

  setAttendance(memberId: number): Promise<boolean>
}

export class CouncilsDataSourceImpl implements CouncilsDataSource {
  static instance: CouncilsDataSourceImpl

  static getInstance = (): CouncilsDataSourceImpl => {
    if (!CouncilsDataSourceImpl.instance) {
      CouncilsDataSourceImpl.instance = new CouncilsDataSourceImpl()
    }

    return CouncilsDataSourceImpl.instance
  }

  async getById(id: number): Promise<CouncilModel> {
    const result = await AxiosClient.get(API_ROUTES.COUNCILS.GET_BY_ID(id))

    if ('error' in result) {
      return {} as CouncilModel
    }

    return result.data as CouncilModel
  }

  async notifyMembers({
    members,
    councilId,
  }: {
    members: INotifyMembers[]
    councilId: number
  }) {
    await AxiosClient.post(
      API_ROUTES.COUNCILS.NOTIFY_MEMBERS(councilId),
      members,
    )
  }

  getAllCouncilsByModuleId = async (
    moduleId: number,
    limit: number,
    offset: number,
  ) => {
    const result = await AxiosClient.get(API_ROUTES.COUNCILS.GET_ALL, {
      params: { moduleId, limit, offset },
    })

    if ('error' in result) {
      return { councils: [], count: 0 }
    }

    return result.data as { councils: CouncilModel[]; count: number }
  }

  create = async (council: ICreateCouncil) => {
    const result = await AxiosClient.post(API_ROUTES.COUNCILS.CREATE, council)

    if ('error' in result) {
      return {} as CouncilModel
    }

    return result.data as CouncilModel
  }

  getAll = async () => {
    const result = await AxiosClient.get(API_ROUTES.COUNCILS.GET_ALL)

    if ('error' in result) {
      return [] as CouncilModel[]
    }

    return result.data as CouncilModel[]
  }

  getByFilters = async (
    filters: ICouncilFilters,
    moduleId: number,
    limit: number,
    offset: number,
  ) => {
    const { startDate, endDate } = filters

    const formattedFilters = {
      moduleId,
      limit,
      offset,
      ...filters,
      startDate: startDate
        ? (startDate as Date).toISOString().split('T')[0]
        : undefined,
      endDate: endDate
        ? (endDate as Date).toISOString().split('T')[0]
        : undefined,
    }

    const result = await AxiosClient.get(API_ROUTES.COUNCILS.GET_BY_FILTERS, {
      params: formattedFilters,
    })

    if ('error' in result) {
      return { councils: [], count: 0 }
    }

    return result.data as { councils: CouncilModel[]; count: number }
  }

  update = async (council: IUpdateCouncil) => {
    const { id, ...rest } = council
    const result = await AxiosClient.patch(
      API_ROUTES.COUNCILS.UPDATE(id as number),
      rest,
    )

    if ('error' in result) {
      return {} as CouncilModel
    }

    return result.data as CouncilModel
  }

  bulkUpdate = async (councils: ICouncil[]) => {
    const result = await AxiosClient.patch(
      API_ROUTES.COUNCILS.BULK_UPDATE,
      councils,
    )

    if ('error' in result) {
      return [] as CouncilModel[]
    }

    return result.data as CouncilModel[]
  }

  getNextNumberAvailable = async (moduleId: number) => {
    const result = await AxiosClient.get(
      API_ROUTES.COUNCILS.GET_NEXT_NUMBER_AVAILABLE(moduleId),
    )

    if ('error' in result) {
      return 0
    }

    return result.data as number
  }

  getCouncilsThatCanReserve = async (moduleId: number) => {
    const result = await AxiosClient.get(
      API_ROUTES.COUNCILS.GET_COUNCILS_THAT_CAN_RESERVE(moduleId),
    )

    if ('error' in result) {
      return [] as CouncilModel[]
    }

    return result.data as CouncilModel[]
  }

  reserveNumeration = async (payload: {
    councilId: number
    start: number
    end: number
  }) => {
    await AxiosClient.post(API_ROUTES.COUNCILS.RESERVE_NUMERATION, payload)
  }

  getAvailableExtensionNumeration = async (councilId: number) => {
    const result = await AxiosClient.get(
      API_ROUTES.COUNCILS.GET_AVAILABLE_EXTENSION_NUMERATION(councilId),
    )

    if ('error' in result) {
      return { start: 0, end: 0, actualStart: 0, actualEnd: 0 }
    }

    return result.data as {
      start: number
      end: number
      actualStart: number
      actualEnd: number
    }
  }

  setAttendance = async (memberId: number) => {
    const result = await AxiosClient.patch(
      API_ROUTES.COUNCILS.SET_ATTENDANCE(memberId),
    )

    if ('error' in result) {
      return false
    }

    return true
  }
}
