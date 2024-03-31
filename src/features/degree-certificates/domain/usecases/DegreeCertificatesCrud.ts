import { DegreeCertificateRepositoryImpl } from '../../data/repositoryImpl'
import { IDegreeCertificatesRepository } from '../IDegreeCertificatesRepository'
import {
  ICreateUpdateDegreeCertificate,
  IDegreeCertificate,
} from '../entities/IDegreeCertificates'

export class DegreeCertificatesCrudServices {
  static instance: IDegreeCertificatesRepository

  static getInstance = (): IDegreeCertificatesRepository => {
    if (!DegreeCertificatesCrudServices.instance) {
      DegreeCertificatesCrudServices.instance =
        new DegreeCertificatesCrudServices(
          DegreeCertificateRepositoryImpl.getInstance(),
        )
    }

    return DegreeCertificatesCrudServices.instance
  }

  constructor(private readonly repository: IDegreeCertificatesRepository) {}

  async createDegreeCertificate(
    degreeCertificate: ICreateUpdateDegreeCertificate,
  ): Promise<IDegreeCertificate> {
    return this.repository.createDegreeCertificate(degreeCertificate)
  }

  async findDegreeCertificateById(
    degreeCertificateId: string,
  ): Promise<IDegreeCertificate> {
    return this.repository.findDegreeCertificateById(degreeCertificateId)
  }

  async findDegreeCertificates(): Promise<IDegreeCertificate[]> {
    return this.repository.findDegreeCertificates()
  }

  async updateDegreeCertificate(
    degreeCertificateId: string,
    degreeCertificate: ICreateUpdateDegreeCertificate,
  ): Promise<IDegreeCertificate> {
    return this.repository.updateDegreeCertificate(
      degreeCertificateId,
      degreeCertificate,
    )
  }

  async deleteDegreeCertificate(degreeCertificateId: string): Promise<void> {
    return this.repository.deleteDegreeCertificate(degreeCertificateId)
  }
}
