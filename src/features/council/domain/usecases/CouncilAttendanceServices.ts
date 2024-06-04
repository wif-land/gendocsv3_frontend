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

  async notifyMembers(payload: {
    members: number[]
    id: number
  }): Promise<void> {
    await this.councilRepository.notifyMembers(payload)
  }

  async handleCouncilAttendance(memberId: number): Promise<void> {
    return await this.councilRepository.handleMemberAttendance(memberId)
  }
}
