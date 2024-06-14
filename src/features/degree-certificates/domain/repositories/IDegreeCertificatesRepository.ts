import { DegreeCertificateModel } from '../../data/models/DegreeCertificateModel'
import { DegreeCertificateForBulk } from '../../presentation/components/DegreeCertificateBulkUploadDialog'
import { IDegreeCertificateFilters } from '../entities/IDegreeCertificateFilters'
import {
  ICreateDegreeCertificate,
  IDegreeCertificate,
} from '../entities/IDegreeCertificates'

export interface IDegreeCertificatesRepository {
  getAll(
    limit: number,
    offset: number,
    carrerId: number,
  ): Promise<{
    count: number
    degreeCertificates: DegreeCertificateModel[]
  }>

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

  create(
    degreeCertificate: ICreateDegreeCertificate,
  ): Promise<DegreeCertificateModel>

  generateNumeration(careerId: number): Promise<{
    firstGenerated: number
    lastGenerated: number
  }>

  getLastNumberToRegister(careerId: number): Promise<number>

  generateDocument(degreeCertificateId: number): Promise<DegreeCertificateModel>

  checkPresentationDate({
    presentationDate,
    duration,
    roomId,
  }: {
    presentationDate?: Date
    duration?: number
    roomId?: number
  }): Promise<void>

  bulkLoad({
    data,
    userId,
  }: {
    data: DegreeCertificateForBulk[]
    userId: number
  }): Promise<boolean>
}
