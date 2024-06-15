import { UseCase } from '../../../../core/usecases/use-case'
import { DegreeCertificateAttendanceRepositoryImpl } from '../../data/repositories/repositoryAttendanceImpl'
import { AttendanceFormValuesProps } from '../../presentation/constants'
import { IDegreeCertificatesAttendancesRepository } from '../repositories/IDegreeCertificatesAttendanceRepository'

interface Params extends AttendanceFormValuesProps {
  degreeCertificateId: number
}

export class EditDegreeCertificateAttendanceUseCase extends UseCase<
  void,
  Params
> {
  private readonly repository: IDegreeCertificatesAttendancesRepository

  constructor() {
    super()
    this.repository = DegreeCertificateAttendanceRepositoryImpl.getInstance()
  }

  call(params: Params) {
    const { functionary, ...rest } = params

    return this.repository.update({
      ...rest,
      functionaryId: functionary.id || 0,
    })
  }
}
