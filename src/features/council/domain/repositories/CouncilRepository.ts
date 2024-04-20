import { CouncilModel } from '../../data/models/CouncilModel'
import { ICouncil } from '../entities/ICouncil'
import { ICouncilFilters } from '../entities/ICouncilFilters'

export interface CouncilRepository {
  getAll: () => Promise<CouncilModel[]>

  getByFilters: (
    filters: ICouncilFilters,
    moduleId: number,
    limit: number,
    offset: number,
  ) => Promise<{
    count: number
    councils: CouncilModel[]
  }>

  update: (data: Partial<ICouncil>) => Promise<CouncilModel>

  create: (councilData: ICouncil) => Promise<CouncilModel>

  getAllCouncilsByModuleId: (
    moduleId: number,
    limit: number,
    offset: number,
  ) => Promise<{
    councils: CouncilModel[]
    count: number
  }>

  bulkUpdate: (councils: Partial<ICouncil>[]) => Promise<CouncilModel[]>
}
