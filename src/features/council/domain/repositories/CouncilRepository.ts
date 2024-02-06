import { CouncilModel } from '../../data/models/CouncilModel'
import { ICouncil } from '../entities/ICouncil'

export interface CouncilRepository {
  getAll: () => Promise<{
    status: number
    councils: CouncilModel[]
  }>

  update: (data: Partial<ICouncil>) => Promise<{
    status: number
    council: CouncilModel
  }>

  create: (councilData: ICouncil) => Promise<{
    status: number
    council: CouncilModel
  }>

  getAllCouncilsByModuleId: (moduleId: number) => Promise<{
    status: number
    councils: CouncilModel[]
  }>

  bulkUpdate: (councils: Partial<ICouncil>[]) => Promise<{
    status: number
    councils: CouncilModel[]
  }>
}
