import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { ICouncil } from '../../domain/entities/ICouncil'
import { CouncilRepository } from '../../domain/repositories/CouncilRepository'
import {
  CouncilsDataSource,
  CouncilsDataSourceImpl,
} from '../datasources/CouncilDatasource'
import { CouncilModel } from '../models/CouncilModel'

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
    limit: number,
    offset: number,
  ) => await this.datasource.getAllCouncilsByModuleId(moduleId, limit, offset)

  getCount = async (moduleId: number) =>
    await this.datasource.councilCountByModuleId(moduleId)

  getAll = async () => await this.datasource.getAll()

  update = async (data: Partial<CouncilModel>) =>
    await this.datasource.update(data)

  create = async (councilData: ICouncil) => {
    try {
      const result = await this.datasource.create(councilData)
      const { status } = result

      if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
        return { status, council: {} as CouncilModel }
      }

      return { status, council: result.council }
    } catch (error) {
      return { status: 500, council: {} as CouncilModel }
    }
  }

  bulkUpdate = async (councils: Partial<ICouncil>[]) =>
    await this.datasource.bulkUpdate(councils)
}
