import {
  ICouncil,
  ICreateCouncil,
  IUpdateCouncil,
} from '../../domain/entities/ICouncil'
import { CouncilRepository } from '../../domain/repositories/CouncilRepository'
import {
  CouncilsDataSource,
  CouncilsDataSourceImpl,
} from '../datasources/CouncilDatasource'
import { ICouncilFilters } from '../../domain/entities/ICouncilFilters'
import { INotifyMembers } from '../../domain/entities/INotifyMembers'
import { PaginationDTO } from '../../../../shared/utils/pagination-dto'

export class CouncilRepositoryImpl implements CouncilRepository {
  static instance: CouncilRepositoryImpl

  static getInstance = (): CouncilRepositoryImpl => {
    if (!CouncilRepositoryImpl.instance) {
      CouncilRepositoryImpl.instance = new CouncilRepositoryImpl(
        CouncilsDataSourceImpl.getInstance(),
      )
    }

    return CouncilRepositoryImpl.instance
  }

  private constructor(private readonly datasource: CouncilsDataSource) {}

  getAllCouncilsByModuleId = async (
    moduleId: number,
    pagination?: PaginationDTO,
  ) => await this.datasource.getAllCouncilsByModuleId(moduleId, pagination)

  getAll = async () => await this.datasource.getAll()

  getByFilters = async (
    filters: ICouncilFilters,
    moduleId: number,
    pagination?: PaginationDTO,
  ) => await this.datasource.getByFilters(filters, moduleId, pagination)

  update = async (data: IUpdateCouncil) => await this.datasource.update(data)

  create = async (data: ICreateCouncil) => await this.datasource.create(data)

  bulkUpdate = async (councils: Partial<ICouncil>[]) =>
    await this.datasource.bulkUpdate(councils)

  notifyMembers = async (payload: {
    members: INotifyMembers[]
    councilId: number
  }) => await this.datasource.notifyMembers(payload)

  getById = async (id: number) => await this.datasource.getById(id)

  getNextNumberAvailable = async (moduleId: number) =>
    await this.datasource.getNextNumberAvailable(moduleId)

  getCouncilsThatCanReserve = async (moduleId: number) =>
    await this.datasource.getCouncilsThatCanReserve(moduleId)

  reserveNumeration = async (payload: {
    councilId: number
    start?: number
    end?: number
    isExtension?: boolean
  }) => await this.datasource.reserveNumeration(payload)

  getAvailableExtensionNumeration = async (councilId: number) =>
    await this.datasource.getAvailableExtensionNumeration(councilId)

  setAttendance = async (memberId: number) =>
    await this.datasource.setAttendance(memberId)
}
