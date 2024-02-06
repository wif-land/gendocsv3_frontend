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

  getById(id: number): Promise<{
    status: number
    council: CouncilModel
  }>

  update(
    id: number,
    council: Partial<CouncilModel>,
  ): Promise<{
    status: number
    council: CouncilModel
  }>

  getAllCouncilsByModuleId(moduleId: number): Promise<{
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

  getById = async (id: number) => {
    throw new Error(`Method not implemented.${id}`)
  }

  update = async (id: number, council: Partial<CouncilModel>) =>
    await this.councilRepository.update({
      ...council,
      id,
    })

  getAllCouncilsByModuleId = async (moduleId: number) =>
    await this.councilRepository.getAllCouncilsByModuleId(moduleId)

  toggleCouncilStatus = async (councils: Partial<ICouncil>[]) =>
    await this.councilRepository.bulkUpdate(councils)
}
