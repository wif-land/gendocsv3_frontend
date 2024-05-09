import { DegreeCertificateModel } from '../../data/models/model'
import { IDegreeCertificateFilters } from '../entities/IDegreeCertificateFilters'
import { IDegreeCertificate } from '../entities/IDegreeCertificates'

export interface IDegreeCertificatesRepository {
  getAll: () => Promise<DegreeCertificateModel[]>

  getByFilters(
    filters: IDegreeCertificateFilters,
    limit: number,
    offset: number,
  ): Promise<{
    count: number
    degreeCertificates: DegreeCertificateModel[]
  }>

  update(
    degreeCertificate: Partial<IDegreeCertificate>,
  ): Promise<DegreeCertificateModel>

  create(degreeCertificate: IDegreeCertificate): Promise<DegreeCertificateModel>
}
