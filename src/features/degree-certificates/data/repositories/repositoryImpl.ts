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
import { DegreeCertificateForBulk } from '../../presentation/components/DegreeBulkUploadDialog'
import { PaginationDTO } from '../../../../shared/utils/pagination-dto'

export class DegreeCertificateRepositoryImpl
  implements IDegreeCertificatesRepository
{
  static instance: DegreeCertificateRepositoryImpl

  static getInstance = () => {
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

  getAll = async (
    filters: IDegreeCertificateFilters,
    pagination?: PaginationDTO,
  ) => await this.datasource.getAll(filters, pagination)

  getByFilters = async (
    filters: IDegreeCertificateFilters,
    pagination?: PaginationDTO,
  ) => await this.datasource.getByFilters(filters, pagination)

  update = async (degreeCertificate: Partial<IDegreeCertificate>) =>
    await this.datasource.update(degreeCertificate)

  create = async (degreeCertificate: ICreateDegreeCertificate) =>
    await this.datasource.create(degreeCertificate)

  delete = async (id: number) => await this.datasource.delete(id)

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

  async bulkLoad({
    data,
    userId,
    retryId,
  }: {
    data: DegreeCertificateForBulk[]
    userId: number
    retryId?: number
  }): Promise<boolean> {
    return await this.datasource.bulkLoad({
      data,
      userId,
      retryId,
    })
  }

  getReports = async (filters: IDegreeCertificateFilters) =>
    await this.datasource.getReports(filters)

  downloadReport = async (filters: IDegreeCertificateFilters) =>
    await this.datasource.downloadReport(filters)

  getEnqueuedNumbers(careerId: number): Promise<number[]> {
    return this.datasource.getEnqueuedNumbers(careerId)
  }
}
