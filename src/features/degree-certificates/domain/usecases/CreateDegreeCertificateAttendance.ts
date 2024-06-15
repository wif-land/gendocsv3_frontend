import { UseCase } from '../../../../core/usecases/use-case'
import { DegreeCertificateRepositoryImpl } from '../../data/repositories/repositoryImpl'
import { AttendanceFormValuesProps } from '../../presentation/constants'
import { IDegreeCertificatesRepository } from '../repositories/IDegreeCertificatesRepository'

interface Params extends AttendanceFormValuesProps {
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
    const { functionary, ...rest } = params

    return this.repository.createAttendance({
      ...rest,
      functionaryId: functionary.id || 0,
    })
  }
}
