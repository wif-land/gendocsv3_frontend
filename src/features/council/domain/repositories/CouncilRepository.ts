import { CouncilModel } from '../../data/models/CouncilModel'
import { ICouncil } from '../entities/ICouncil'

export interface CouncilRepository {
  getAll: () => Promise<{
    status: number
    councils: CouncilModel[]
  }>

  getCount: (moduleId: number) => Promise<number>

  update: (data: Partial<ICouncil>) => Promise<{
    status: number
    council: CouncilModel
  }>

  create: (councilData: ICouncil) => Promise<{
    status: number
    council: CouncilModel
  }>

  getAllCouncilsByModuleId: (
    moduleId: number,
    limit: number,
    offset: number,
  ) => Promise<{
    status: number
    councils: CouncilModel[]
  }>

  bulkUpdate: (councils: Partial<ICouncil>[]) => Promise<{
    status: number
    councils: CouncilModel[]
  }>
}
