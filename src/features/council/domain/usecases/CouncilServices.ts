import { CouncilModel } from '../../data/models/CouncilModel'
import { CouncilRepositoryImpl } from '../../data/repositories/CouncilRepositoryImpl'
import { CouncilRepository } from '../repositories/CouncilRepository'

interface CouncilUseCases {
  create(council: CouncilModel): Promise<{
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
  }>

  getAllCouncilsByModuleId(moduleId: number): Promise<{
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

  create = async (career: CouncilModel) =>
    await this.councilRepository.create(career)

  getAll = async () => await this.councilRepository.getAll()

  getById = async (id: number) => {
    throw new Error(`Method not implemented.${id}`)
  }

  update = async (id: number, career: Partial<CouncilModel>) =>
    await this.councilRepository.update(id, career)

  getAllCouncilsByModuleId = async (moduleId: number) =>
    await this.councilRepository.getAllCouncilsByModuleId(moduleId)
}
