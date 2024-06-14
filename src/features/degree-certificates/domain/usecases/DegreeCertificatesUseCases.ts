import { DegreeCertificateRepositoryImpl } from '../../data/repositories/repositoryImpl'
import {
  ICreateDegreeCertificate,
  IDegreeCertificate,
} from '../entities/IDegreeCertificates'
import { DegreeCertificateModel } from '../../data/models/DegreeCertificateModel'
import { IDegreeCertificateFilters } from '../entities/IDegreeCertificateFilters'
import { DegreeCertificateForBulk } from '../../presentation/components/DegreeCertificateBulkUploadDialog'
import { IDegreeCertificatesAttendee } from '../entities/IDegreeCertificateAttendee'
import { IDegreeCertificatesRepository } from '../repositories/IDegreeCertificatesRepository'

interface CertificateDegreeUseCases {
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

  getById(id: number): Promise<DegreeCertificateModel>

  setAttendance(id: number): Promise<void>

  bulkLoad({
    data,
    userId,
  }: {
    data: DegreeCertificateForBulk[]
    userId: number
  }): Promise<boolean>

  getReports(filters: IDegreeCertificateFilters): Promise<{
    count: number
    degreeCertificates: DegreeCertificateModel[]
  }>

  downloadReport(filters: IDegreeCertificateFilters): Promise<{
    fileName: string
    file: string
  }>

  getAttendees(id: number): Promise<IDegreeCertificatesAttendee[]>
}

export class DegreeCertificatesUseCasesImpl
  implements CertificateDegreeUseCases
{
  static instance: CertificateDegreeUseCases

  static getInstance = () => {
    if (!DegreeCertificatesUseCasesImpl.instance) {
      DegreeCertificatesUseCasesImpl.instance =
        new DegreeCertificatesUseCasesImpl(
          DegreeCertificateRepositoryImpl.getInstance(),
        )
    }

    return DegreeCertificatesUseCasesImpl.instance
  }

  constructor(private readonly repository: IDegreeCertificatesRepository) {}

  getAttendees(id: number) {
    return this.repository.getAttendance(id)
  }

  setAttendance(id: number): Promise<void> {
    return this.repository.setAttendance(id)
  }

  getById(id: number) {
    return this.repository.getById(id)
  }

  getAll = async (limit: number, offset: number, carrerId: number) =>
    await this.repository.getAll(limit, offset, carrerId)

  getByFilters = async (
    filters: IDegreeCertificateFilters,
    limit: number,
    offset: number,
  ) => await this.repository.getByFilters(filters, limit, offset)

  update = async (degreeCertificate: Partial<IDegreeCertificate>) =>
    await this.repository.update(degreeCertificate)

  create = async (degreeCertificate: ICreateDegreeCertificate) =>
    await this.repository.create(degreeCertificate)

  generateNumeration = async (careerId: number) =>
    await this.repository.generateNumeration(careerId)

  getLastNumberToRegister = async (careerId: number) =>
    await this.repository.getLastNumberToRegister(careerId)

  generateDocument = async (degreeCertificateId: number) =>
    await this.repository.generateDocument(degreeCertificateId)

  async checkPresentationDate({
    presentationDate,
    duration,
    roomId,
  }: {
    presentationDate?: Date
    duration?: number
    roomId?: number
  }): Promise<void> {
    await this.repository.checkPresentationDate({
      presentationDate,
      duration,
      roomId,
    })
  }

  async bulkLoad({
    data,
    userId,
  }: {
    data: DegreeCertificateForBulk[]
    userId: number
  }): Promise<boolean> {
    return await this.repository.bulkLoad({
      data,
      userId,
    })
  }

  getReports = async (filters: IDegreeCertificateFilters) =>
    await this.repository.getReports(filters)

  downloadReport = async (filters: IDegreeCertificateFilters) =>
    await this.repository.downloadReport(filters)
}
