import { CouncilModel } from '../../data/models/CouncilModel'
import { CouncilRepositoryImpl } from '../../data/repositories/CouncilRepositoryImpl'
import { ICouncil } from '../entities/ICouncil'
import { ICouncilFilters } from '../entities/ICouncilFilters'
import { CouncilRepository } from '../repositories/CouncilRepository'

interface CouncilUseCases {
  create(council: ICouncil): Promise<CouncilModel>

  getAll(): Promise<CouncilModel[]>

  getByFilters(
    filters: ICouncilFilters,
    moduleId: number,
    limit: number,
    offset: number,
  ): Promise<{
    count: number
    councils: CouncilModel[]
  }>

  update(id: number, council: Partial<CouncilModel>): Promise<CouncilModel>

  getAllCouncilsByModuleId(
    moduleId: number,
    limit: number,
    offset: number,
  ): Promise<{
    councils: CouncilModel[]
    count: number
  }>

  toggleCouncilStatus(councils: Partial<ICouncil>[]): Promise<CouncilModel[]>

  notifyMembers(payload: { members: number[] }): Promise<void>
}

export class CouncilsUseCasesImpl implements CouncilUseCases {
  static instance: CouncilsUseCasesImpl

  static getInstance = (): CouncilsUseCasesImpl => {
    if (!CouncilsUseCasesImpl.instance) {
      CouncilsUseCasesImpl.instance = new CouncilsUseCasesImpl()
    }

    return CouncilsUseCasesImpl.instance
  }

  private councilRepository: CouncilRepository =
    CouncilRepositoryImpl.getInstance()

  create = async (career: ICouncil) =>
    await this.councilRepository.create(career)

  async notifyMembers(payload: {
    members: number[]
    id: number
  }): Promise<void> {
    const { members } = payload

    await this.councilRepository.notifyMembers({
      id: payload.id,
      members,
    })
  }

  getAll = async () => await this.councilRepository.getAll()

  getByFilters = async (
    filters: ICouncilFilters,
    moduleId: number,
    limit = 5,
    offset = 0,
  ) =>
    await this.councilRepository.getByFilters(filters, moduleId, limit, offset)

  update = async (id: number, council: Partial<CouncilModel>) =>
    await this.councilRepository.update({
      ...council,
      id,
    })

  getAllCouncilsByModuleId = async (
    moduleId: number,
    limit: number,
    offset: number,
  ) =>
    await this.councilRepository.getAllCouncilsByModuleId(
      moduleId,
      limit,
      offset,
    )

  toggleCouncilStatus = async (councils: Partial<ICouncil>[]) =>
    await this.councilRepository.bulkUpdate(councils)
}
