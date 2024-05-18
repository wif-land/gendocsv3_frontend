import { IMember } from '../../../default-members/domain/entities/IDefaultMembers'
import { ICouncilAttendee } from '../../domain/entities/ICouncilAttendee'

export class CouncilAttendee implements ICouncilAttendee {
  hasAttended: boolean

  hasBeenNotified: boolean

  id?: number | undefined
  isStudent: boolean
  member: IMember
  positionName: string
  positionOrder: number
  defaultMemberId: number

  constructor(props: ICouncilAttendee) {
    this.hasAttended = props.hasAttended
    this.hasBeenNotified = props.hasBeenNotified
    this.id = props.id
    this.isStudent = props.isStudent
    this.member = props.member
    this.positionName = props.positionName
    this.positionOrder = props.positionOrder
    this.defaultMemberId = props.defaultMemberId
  }
}
