import { IDegreeCertificatesRepository } from '../domain/IDegreeCertificatesRepository'
import {
  ICreateUpdateDegreeCertificate,
  IDegreeCertificate,
} from '../domain/entities/IDegreeCertificates'
import {
  DegreeCertificateDatasourceImpl,
  IDegreeCertificateDatasource,
} from './DegreeCertificateDatasource'

export class DegreeCertificateRepositoryImpl
  implements IDegreeCertificatesRepository
{
  static instance: IDegreeCertificateDatasource

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

  async createDegreeCertificate(
    degreeCertificate: ICreateUpdateDegreeCertificate,
  ): Promise<IDegreeCertificate> {
    return await this.datasource.createDegreeCertificate(degreeCertificate)
  }

  findDegreeCertificateById(
    degreeCertificateId: string,
  ): Promise<IDegreeCertificate> {
    throw new Error(`Method not implemented.${degreeCertificateId}`)
  }
  findDegreeCertificates(): Promise<IDegreeCertificate[]> {
    throw new Error('Method not implemented.')
  }
  updateDegreeCertificate(
    degreeCertificateId: string,
    degreeCertificate: ICreateUpdateDegreeCertificate,
  ): Promise<IDegreeCertificate> {
    throw new Error(
      `Method not implemented.${degreeCertificateId} ${degreeCertificate}`,
    )
  }
  deleteDegreeCertificate(degreeCertificateId: string): Promise<void> {
    throw new Error(`Method not implemented.${degreeCertificateId}`)
  }
}
