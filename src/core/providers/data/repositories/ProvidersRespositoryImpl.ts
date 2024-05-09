import { ProvidersRepository } from '../../domain/repositories/ProvidersRepository'
import {
  ProvidersDataSource,
  ProvidersDataSourceImpl,
} from '../datasource/providers-datasource'

export class ProvidersRepositoryImpl implements ProvidersRepository {
  private static instance: ProvidersRepositoryImpl

  static getInstance = (): ProvidersRepositoryImpl => {
    if (!ProvidersRepositoryImpl.instance) {
      ProvidersRepositoryImpl.instance = new ProvidersRepositoryImpl(
        ProvidersDataSourceImpl.getInstance(),
      )
    }

    return ProvidersRepositoryImpl.instance
  }

  private constructor(private readonly datasource: ProvidersDataSource) {}

  getAllCities = async () => await this.datasource.getAllCities()

  getAllProvinces = async () => await this.datasource.getAllProvinces()

  getAllCertificateTypes = async () =>
    await this.datasource.getAllCertificateTypes()

  getAllCertificateStatus = async () =>
    await this.datasource.getAllCertificateStatus()

  getAllDegreeModalities = async () =>
    await this.datasource.getAllDegreeModalities()

  getAllRooms = async () => await this.datasource.getAllRooms()
}
