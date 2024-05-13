import { CertificateStatusModel } from '../../data/models/certificateStatusModel'
import { CertificateTypeModel } from '../../data/models/certificateTypeModel'
import { CityModel } from '../../data/models/cityModel'
import { DegreeModalityModel } from '../../data/models/degreeModalityModel'
import { ProvinceModel } from '../../data/models/provinceModel'
import { RoomModel } from '../../data/models/roomModel'
import { ProvidersRepositoryImpl } from '../../data/repositories/ProvidersRespositoryImpl'
import { ProvidersRepository } from '../repositories/ProvidersRepository'

interface ProvidersUseCases {
  getAllCities(): Promise<CityModel[]>

  getAllProvinces(): Promise<ProvinceModel[]>

  getAllCertificateTypes(): Promise<CertificateTypeModel[]>

  getAllCertificateStatus(): Promise<CertificateStatusModel[]>

  getAllDegreeModalities(): Promise<DegreeModalityModel[]>

  getAllRooms(): Promise<RoomModel[]>
}

export class ProvidersUseCasesImpl implements ProvidersUseCases {
  static instance: ProvidersUseCasesImpl

  static getInstance = (): ProvidersUseCasesImpl => {
    if (!ProvidersUseCasesImpl.instance) {
      ProvidersUseCasesImpl.instance = new ProvidersUseCasesImpl()
    }

    return ProvidersUseCasesImpl.instance
  }

  private providerRepository: ProvidersRepository =
    ProvidersRepositoryImpl.getInstance()

  getAllCities = async () => await this.providerRepository.getAllCities()

  getAllProvinces = async () => await this.providerRepository.getAllProvinces()

  getAllCertificateTypes = async () =>
    await this.providerRepository.getAllCertificateTypes()

  getAllCertificateStatus = async () =>
    await this.providerRepository.getAllCertificateStatus()

  getAllDegreeModalities = async () =>
    await this.providerRepository.getAllDegreeModalities()

  getAllRooms = async () => await this.providerRepository.getAllRooms()
}
