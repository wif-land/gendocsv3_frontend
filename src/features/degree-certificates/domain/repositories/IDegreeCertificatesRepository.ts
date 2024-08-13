import { PaginationDTO } from '../../../../shared/utils/pagination-dto'
import { DegreeCertificateModel } from '../../data/models/DegreeCertificateModel'
import { DegreeCertificateForBulk } from '../../presentation/components/DegreeBulkUploadDialog'
import { IDegreeCertificateFilters } from '../entities/IDegreeCertificateFilters'
import {
  ICreateDegreeCertificate,
  IDegreeCertificate,
} from '../entities/IDegreeCertificates'

export interface IDegreeCertificatesRepository {
  getAll(
    filters: IDegreeCertificateFilters,
    pagination?: PaginationDTO,
  ): Promise<{
    count: number
    degreeCertificates: DegreeCertificateModel[]
  }>

  getByFilters(
    filters: IDegreeCertificateFilters,
    pagination?: PaginationDTO,
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

  delete(id: number): Promise<boolean>

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

  getById(id: number): Promise<DegreeCertificateModel>

  bulkLoad({
    data,
    userId,
    retryId,
  }: {
    data: DegreeCertificateForBulk[]
    userId: number
    retryId?: number
  }): Promise<boolean>

  downloadReport(filters: IDegreeCertificateFilters): Promise<{
    fileName: string
    file: string
  }>

  getReports(filters: IDegreeCertificateFilters): Promise<{
    count: number
    degreeCertificates: DegreeCertificateModel[]
  }>
}
