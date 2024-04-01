import {
  ICreateUpdateDegreeCertificate,
  IDegreeCertificate,
} from '../domain/entities/IDegreeCertificates'

export interface IDegreeCertificateDatasource {
  createDegreeCertificate(
    degreeCertificate: ICreateUpdateDegreeCertificate,
  ): Promise<IDegreeCertificate>

  findDegreeCertificateById(
    degreeCertificateId: string,
  ): Promise<IDegreeCertificate>

  findDegreeCertificates(): Promise<IDegreeCertificate[]>

  updateDegreeCertificate(
    degreeCertificateId: string,
    degreeCertificate: ICreateUpdateDegreeCertificate,
  ): Promise<IDegreeCertificate>

  deleteDegreeCertificate(degreeCertificateId: string): Promise<void>
}

export class DegreeCertificateDatasourceImpl
  implements IDegreeCertificateDatasource
{
  static instance: IDegreeCertificateDatasource

  static getInstance = (): IDegreeCertificateDatasource => {
    if (!DegreeCertificateDatasourceImpl.instance) {
      DegreeCertificateDatasourceImpl.instance =
        new DegreeCertificateDatasourceImpl()
    }

    return DegreeCertificateDatasourceImpl.instance
  }

  createDegreeCertificate(
    degreeCertificate: ICreateUpdateDegreeCertificate,
  ): Promise<IDegreeCertificate> {
    throw new Error(`Method not implemented.${degreeCertificate}`)
  }
  deleteDegreeCertificate(degreeCertificateId: string): Promise<void> {
    throw new Error(`Method not implemented.${degreeCertificateId}`)
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
}
