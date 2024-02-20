import { CareerModel } from '../../data/models/CareerModel'
import { CareerRepositoryImpl } from '../../data/repositories/CouncilRepositoryImpl'
import { ICareer } from '../entities/ICareer'

interface CareerUseCases {
  create(Career: ICareer): Promise<{
    status: number
    career: CareerModel
  }>

  getAll(): Promise<
    | {
        status: number
        careers: CareerModel[]
      }
    | boolean
  >

  update(
    id: number,
    Career: Partial<CareerModel>,
  ): Promise<{
    status: number
  }>
}

export class CareersUseCasesImpl implements CareerUseCases {
  static instance: CareersUseCasesImpl

  static getInstance = (): CareersUseCasesImpl => {
    if (!CareersUseCasesImpl.instance) {
      CareersUseCasesImpl.instance = new CareersUseCasesImpl()
    }

    return CareersUseCasesImpl.instance
  }

  private careerRepository: CareerRepositoryImpl =
    CareerRepositoryImpl.getInstance()

  create = async (career: ICareer) => await this.careerRepository.create(career)

  getAll = async () => {
    try {
      return await this.careerRepository.getAll()
    } catch (error) {
      console.error('Error getting careers', error)
      return false
    }
  }

  update = async (id: number, career: Partial<CareerModel>) =>
    await this.careerRepository.update({
      ...career,
      id,
    })
}
