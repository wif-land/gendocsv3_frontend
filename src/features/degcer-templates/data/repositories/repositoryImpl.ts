import { IDegreeCertificatesRepository } from '../../domain/repositories/IDegreeCertificatesRepository'
import { IDegreeCertificate } from '../../domain/entities/IDegreeCertificates'
import {
  DegreeCertificateDatasourceImpl,
  IDegCerTemplatesDatasource,
} from '../datasources/datasource'
import { IDegreeCertificateFilters } from '../../domain/entities/IDegreeCertificateFilters'

export class DegreeCertificateRepositoryImpl
  implements IDegreeCertificatesRepository
{
  static instance: DegreeCertificateRepositoryImpl

  static getInstance = (): IDegCerTemplatesDatasource => {
    if (!DegreeCertificateRepositoryImpl.instance) {
      DegreeCertificateRepositoryImpl.instance =
        new DegreeCertificateRepositoryImpl(
          DegreeCertificateDatasourceImpl.getInstance(),
        )
    }

    return DegreeCertificateRepositoryImpl.instance
  }

  private constructor(
    private readonly datasource: IDegCerTemplatesDatasource,
  ) {}

  getAll = async (limit: number, offset: number) =>
    await this.datasource.getAllByCareerId(limit, offset)

  getByFilters = async (
    filters: IDegreeCertificateFilters,
    limit: number,
    offset: number,
  ) => await this.datasource.getByFilters(filters, limit, offset)

  update = async (degreeCertificate: Partial<IDegreeCertificate>) =>
    await this.datasource.update(degreeCertificate)

  create = async (degreeCertificate: IDegreeCertificate) =>
    await this.datasource.create(degreeCertificate)
}
