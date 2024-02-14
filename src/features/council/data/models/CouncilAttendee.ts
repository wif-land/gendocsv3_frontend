import { FunctionaryModel } from '../../../functionaries/data/models/FunctionatyModel'
import { CouncilAttendanceRole } from '../../domain/entities/ICouncil'
import { ICouncilAttendee } from '../../domain/entities/ICouncilAttendee'

export class CouncilAttendee implements ICouncilAttendee {
  hasAttended: boolean

  hasBeenNotified: boolean

  role: CouncilAttendanceRole

  functionary: FunctionaryModel

  constructor(props: ICouncilAttendee) {
    this.hasAttended = props.hasAttended
    this.hasBeenNotified = props.hasBeenNotified
    this.role = props.role
    this.functionary = props.functionary
  }
}
