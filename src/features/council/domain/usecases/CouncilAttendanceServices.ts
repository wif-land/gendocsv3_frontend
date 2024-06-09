import { CouncilRepositoryImpl } from '../../data/repositories/CouncilRepositoryImpl'

export class CouncilAttendanceServices {
  static instance: CouncilAttendanceServices
  private councilRepository = CouncilRepositoryImpl.getInstance()

  static getInstance = (): CouncilAttendanceServices => {
    if (!CouncilAttendanceServices.instance) {
      CouncilAttendanceServices.instance = new CouncilAttendanceServices()
    }

    return CouncilAttendanceServices.instance
  }
}
