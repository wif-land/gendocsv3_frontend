import { FunctionaryModel } from '../../../functionaries/data/models/FunctionatyModel'
import { CouncilAttendanceRole } from './ICouncil'

export interface ICouncilAttendee {
  hasAttended: boolean

  hasBeenNotified: boolean

  role: CouncilAttendanceRole

  functionary: FunctionaryModel
}

export interface ICreateCouncilAttendee {
  functionaryId: string

  role: CouncilAttendanceRole
}
