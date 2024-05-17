import { CareerModel } from '../../data/models/CareerModel'
import { CareerRepositoryImpl } from '../../data/repositories/CareerRepositoryImpl'
import { ICreateCareer, IUpdateCareer } from '../entities/ICareer'

interface CareerUseCases {
  create(Career: ICreateCareer): Promise<CareerModel>

  getAll(): Promise<CareerModel[]>

  update(id: number, career: IUpdateCareer): Promise<CareerModel>
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

  create = async (career: ICreateCareer) => {
    const data = {
      ...career,
      coordinator: career.coordinator || 0,
    }

    delete data.id

    return await this.careerRepository.create(data)
  }

  update = async (id: number, career: IUpdateCareer) =>
    await this.careerRepository.update({
      ...career,
      coordinator: career.coordinator || 0,
      id,
    })

  getAll = async () => await this.careerRepository.getAll()
}
