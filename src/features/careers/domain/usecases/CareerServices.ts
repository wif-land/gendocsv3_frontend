import { CareerModel } from '../../data/models/CareerModel'
import { CareerRepositoryImpl } from '../../data/repositories/CareerRepositoryImpl'
import { ICareer } from '../entities/ICareer'

interface CareerUseCases {
  create(Career: ICareer): Promise<CareerModel>

  getAll(): Promise<CareerModel[]>

  update(id: number, Career: Partial<CareerModel>): Promise<CareerModel>
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

  getAll = async () => await this.careerRepository.getAll()

  update = async (id: number, career: Partial<CareerModel>) =>
    await this.careerRepository.update({
      ...career,
      id,
    })
}
