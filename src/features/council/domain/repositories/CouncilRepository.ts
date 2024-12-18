import { PaginationDTO } from '../../../../shared/utils/pagination-dto'
import { CouncilModel } from '../../data/models/CouncilModel'
import { ICouncil, ICreateCouncil, IUpdateCouncil } from '../entities/ICouncil'
import { ICouncilFilters } from '../entities/ICouncilFilters'
import { INotifyMembers } from '../entities/INotifyMembers'

export interface CouncilRepository {
  getAll: () => Promise<{ councils: CouncilModel[]; count: number }>

  getByFilters: (
    filters: ICouncilFilters,
    moduleId: number,
    pagination?: PaginationDTO,
  ) => Promise<{
    count: number
    councils: CouncilModel[]
  }>

  update: (data: IUpdateCouncil) => Promise<CouncilModel>

  create: (data: ICreateCouncil) => Promise<CouncilModel>

  getAllCouncilsByModuleId: (
    moduleId: number,
    pagination?: PaginationDTO,
  ) => Promise<{
    councils: CouncilModel[]
    count: number
  }>

  bulkUpdate: (councils: Partial<ICouncil>[]) => Promise<CouncilModel[]>

  notifyMembers: (payload: {
    members: INotifyMembers[]
    councilId: number
  }) => Promise<void>

  getById: (id: number) => Promise<CouncilModel>

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

  setAttendance: (memberId: number) => Promise<boolean>
}
