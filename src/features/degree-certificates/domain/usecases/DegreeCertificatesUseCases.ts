import { DegreeCertificateRepositoryImpl } from '../../data/repositories/repositoryImpl'
import { IDegreeCertificate } from '../entities/IDegreeCertificates'
import { DegreeCertificateModel } from '../../data/models/models'
import { IDegreeCertificateFilters } from '../entities/IDegreeCertificateFilters'

interface CertificateDegreeUseCases {
  getAll(
    limit: number,
    offset: number,
  ): Promise<{
    status: number
    data: {
      count: number
      degreeCertificates: DegreeCertificateModel[]
    }
  }>

  getByFilters(
    filters: IDegreeCertificateFilters,
    limit: number,
    offset: number,
  ): Promise<{
    status: number
    data: {
      count: number
      degreeCertificates: DegreeCertificateModel[]
    }
  }>

  update(degreeCertificate: Partial<IDegreeCertificate>): Promise<{
    status: number
    degreeCertificate: DegreeCertificateModel
  }>

  create(degreeCertificate: IDegreeCertificate): Promise<{
    status: number
    degreeCertificate: DegreeCertificateModel
  }>
}

export class DegreeCertificatesUseCasesImpl
  implements CertificateDegreeUseCases
{
  static instance: CertificateDegreeUseCases

  static getInstance = (): CertificateDegreeUseCases => {
    if (!DegreeCertificatesUseCasesImpl.instance) {
      DegreeCertificatesUseCasesImpl.instance =
        new DegreeCertificatesUseCasesImpl(
          DegreeCertificateRepositoryImpl.getInstance(),
        )
    }

    return DegreeCertificatesUseCasesImpl.instance
  }

  constructor(private readonly repository: CertificateDegreeUseCases) {}

  getAll = async (limit: number, offset: number) =>
    await this.repository.getAll(limit, offset)

  getByFilters = async (
    filters: IDegreeCertificateFilters,
    limit: number,
    offset: number,
  ) => await this.repository.getByFilters(filters, limit, offset)

  update = async (degreeCertificate: Partial<IDegreeCertificate>) =>
    await this.repository.update(degreeCertificate)

  create = async (degreeCertificate: IDegreeCertificate) =>
    await this.repository.create(degreeCertificate)
}
