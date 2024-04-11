import { DegreeCertificateModel } from '../../data/models/CertificateDegreeModel'
import { IDegreeCertificateFilters } from '../entities/IDegreeCertificateFilters'
import { IDegreeCertificate } from '../entities/IDegreeCertificates'

export interface IDegreeCertificatesRepository {
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
