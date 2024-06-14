import { UseCase } from '../../../../core/usecases/use-case'
import { DegreeCertificateRepositoryImpl } from '../../data/repositories/repositoryImpl'
import { IDegreeCertificatesAttendee } from '../entities/IDegreeCertificateAttendee'
import { IDegreeCertificatesRepository } from '../repositories/IDegreeCertificatesRepository'

interface Params extends IDegreeCertificatesAttendee {
  degreeCertificateId: number
}

export class CreateDegreeCertificateAttendanceUseCase extends UseCase<
  void,
  Params
> {
  private readonly repository: IDegreeCertificatesRepository

  constructor() {
    super()
    this.repository = DegreeCertificateRepositoryImpl.getInstance()
  }

  call(params: Params) {
    return this.repository.createAttendance(params)
  }
}
