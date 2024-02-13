import { CouncilModel } from '../../data/models/CouncilModel'
import { ICouncil } from '../entities/ICouncil'

export interface CouncilRepository {
  getAll: () => Promise<{
    status: number
    councils: CouncilModel[]
  }>

  getByTerm: (
    term: string,
    moduleId: number,
    limit: number,
    offset: number,
  ) => Promise<{
    status: number
    data: {
      count: number
      councils: CouncilModel[]
    }
  }>

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
    data: {
      councils: CouncilModel[]
      count: number
    }
  }>

  bulkUpdate: (councils: Partial<ICouncil>[]) => Promise<{
    status: number
    councils: CouncilModel[]
  }>
}
