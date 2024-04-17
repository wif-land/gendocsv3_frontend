import { CertificateStatusModel } from "../../data/models/certificateStatusModel"
import { CertificateTypeModel } from "../../data/models/certificateTypeModel"
import { CityModel } from "../../data/models/cityModel"
import { DegreeModalityModel } from "../../data/models/degreeModalityModel"
import { ProvinceModel } from "../../data/models/provinceModel"
import { RoomModel } from "../../data/models/roomModel"
import { ProvidersRepositoryImpl } from "../../data/repositories/ProvidersRespositoryImpl"
import { ProvidersRepository } from "../repositories/ProvidersRepository"


interface ProvidersUseCases {
  getAllCities(): Promise<{
    status: number
    cities: CityModel[]
  }>

  getAllProvinces(): Promise<{
    status: number
    provinces: ProvinceModel[]
  }>

  getAllCertificateTypes(): Promise<{
    status: number
    certificateTypes: CertificateTypeModel[]
  }>

  getAllCertificateStatus(): Promise<{
    status: number
    certificateStatus: CertificateStatusModel[]
  }>

  getAllDegreeModalities(): Promise<{
    status: number
    degreeModalities: DegreeModalityModel[]
  }>

  getAllRooms(): Promise<{
    status: number
    rooms: RoomModel[]
  }>

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

  getAllCertificateTypes = async () => await this.providerRepository.getAllCertificateTypes()

  getAllCertificateStatus = async () => await this.providerRepository.getAllCertificateStatus()

  getAllDegreeModalities = async () => await this.providerRepository.getAllDegreeModalities()

  getAllRooms = async () => await this.providerRepository.getAllRooms()
}
