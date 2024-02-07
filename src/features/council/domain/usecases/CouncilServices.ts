import { CouncilModel } from '../../data/models/CouncilModel'
import { CouncilRepositoryImpl } from '../../data/repositories/CouncilRepositoryImpl'
import { ICouncil } from '../entities/ICouncil'
import { CouncilRepository } from '../repositories/CouncilRepository'

interface CouncilUseCases {
  create(council: ICouncil): Promise<{
    status: number
    council: CouncilModel
  }>

  getAll(): Promise<{
    status: number
    councils: CouncilModel[]
  }>

  getCount(moduleId: number): Promise<number>

  getByTerm(
    term: string,
    moduleId: number,
  ): Promise<{
    status: number
    council: CouncilModel[]
  }>

  update(
    id: number,
    council: Partial<CouncilModel>,
  ): Promise<{
    status: number
    council: CouncilModel
  }>

  getAllCouncilsByModuleId(
    moduleId: number,
    limit: number,
    offset: number,
  ): Promise<{
    status: number
    councils: CouncilModel[]
  }>

  toggleCouncilStatus(councils: Partial<ICouncil>[]): Promise<{
    status: number
    councils: CouncilModel[]
  }>
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

  getAll = async () => await this.councilRepository.getAll()

  getCount = async (moduleId: number) =>
    await this.councilRepository.getCount(moduleId)

  getByTerm = async (term: string, moduleId: number) =>
    await this.councilRepository.getByTerm(term, moduleId)

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
