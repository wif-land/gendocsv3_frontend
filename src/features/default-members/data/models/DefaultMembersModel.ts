import { IDefaultMembers, IMember } from '../../domain/entities/DefaultMembers'

export class DefaultMemberModel implements IDefaultMembers {
  positionName: string
  member: IMember
  positionOrder: number
  isStudent: boolean
  action: string
  id?: number

  constructor(
    props: IDefaultMembers & {
      action?: string
      id?: number
    },
  ) {
    this.positionName = props.positionName
    this.member = props.member as IMember
    this.positionOrder = props.positionOrder
    this.isStudent = props.isStudent
    this.action = props.action || 'new'
    this.id = props.id
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJson(json: Record<string, any>): DefaultMemberModel {
    return new DefaultMemberModel({
      positionOrder: json.positionOrder,
      isStudent: json.isStudent,
      positionName: json.positionName,
      member: json.member,
      action: json.action,
      id: json.id,
    })
  }

  toJson(): Record<string, unknown> {
    return {
      positionOrder: this.positionOrder,
      positionName: this.positionName,
      member: this.member,
      isStudent: this.isStudent,
      action: this.action,
      id: this.id,
    }
  }
}
