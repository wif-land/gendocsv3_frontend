import { IDegreeCertificatesRepository } from '../../domain/repositories/IDegreeCertificatesRepository'
import {
  ICreateDegreeCertificate,
  IDegreeCertificate,
} from '../../domain/entities/IDegreeCertificates'
import {
  DegreeCertificateDatasourceImpl,
  IDegreeCertificateDatasource,
} from '../datasources/datasource'
import { IDegreeCertificateFilters } from '../../domain/entities/IDegreeCertificateFilters'
import { DegreeCertificateForBulk } from '../../presentation/components/DegreeCertificateBulkUploadDialog'

export class DegreeCertificateRepositoryImpl
  implements IDegreeCertificatesRepository
{
  static instance: DegreeCertificateRepositoryImpl

  static getInstance = (): IDegreeCertificateDatasource => {
    if (!DegreeCertificateRepositoryImpl.instance) {
      DegreeCertificateRepositoryImpl.instance =
        new DegreeCertificateRepositoryImpl(
          DegreeCertificateDatasourceImpl.getInstance(),
        )
    }

    return DegreeCertificateRepositoryImpl.instance
  }

  private constructor(
    private readonly datasource: IDegreeCertificateDatasource,
  ) {}

  getById(id: number) {
    return this.datasource.getById(id)
  }

  getAll = async (limit: number, offset: number, carrerId: number) =>
    await this.datasource.getAll(limit, offset, carrerId)

  getByFilters = async (
    filters: IDegreeCertificateFilters,
    limit: number,
    offset: number,
  ) => await this.datasource.getByFilters(filters, limit, offset)

  update = async (degreeCertificate: Partial<IDegreeCertificate>) =>
    await this.datasource.update(degreeCertificate)

  create = async (degreeCertificate: ICreateDegreeCertificate) =>
    await this.datasource.create(degreeCertificate)

  generateNumeration = async (careerId: number) =>
    await this.datasource.generateNumeration(careerId)

  getLastNumberToRegister = async (careerId: number) =>
    await this.datasource.getLastNumberToRegister(careerId)

  generateDocument = async (degreeCertificateId: number) =>
    await this.datasource.generateDocument(degreeCertificateId)

  async checkPresentationDate({
    presentationDate,
    duration,
    roomId,
  }: {
    presentationDate?: Date
    duration?: number
    roomId?: number
  }): Promise<void> {
    await this.datasource.checkPresentationDate({
      presentationDate,
      duration,
      roomId,
    })
  }

  setAttendance = async (id: number) => await this.datasource.setAttendance(id)

  async bulkLoad({
    data,
    userId,
  }: {
    data: DegreeCertificateForBulk[]
    userId: number
  }): Promise<boolean> {
    return await this.datasource.bulkLoad({
      data,
      userId,
    })
  }

  getReports = async (carrerId: number, isEnd: string) =>
    await this.datasource.getReports(carrerId, isEnd)
}
