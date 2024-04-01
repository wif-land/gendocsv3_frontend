import {
  ICreateUpdateDegreeCertificate,
  IDegreeCertificate,
} from './entities/IDegreeCertificates'

export interface IDegreeCertificatesRepository {
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
