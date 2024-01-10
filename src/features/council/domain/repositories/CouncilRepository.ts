import { CouncilModel } from '../../data/models/CouncilModel'
import { ICouncil } from '../entities/ICouncil'

export interface CouncilRepository {
  getAll: () => Promise<{
    status: number
    councils: CouncilModel[]
  }>

  update: (
    id: number,
    data: Partial<ICouncil>,
  ) => Promise<{
    status: number
  }>

  create: (councilData: CouncilModel) => Promise<{
    status: number
    council: CouncilModel
  }>

  getAllCouncilsByModuleId: (moduleId: number) => Promise<{
    status: number
    councils: CouncilModel[]
  }>
}
