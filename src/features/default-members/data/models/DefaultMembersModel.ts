import { IDefaultMembers, IMember } from '../../domain/entities/DefaultMembers'

export class DefaultMemberModel implements IDefaultMembers {
  order: number
  positionName: string
  member: IMember

  constructor(props: IDefaultMembers) {
    this.order = props.order
    this.positionName = props.positionName
    this.member = props.member as IMember
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJson(json: Record<string, any>): DefaultMemberModel {
    return new DefaultMemberModel({
      order: json.order,
      positionName: json.positionName,
      member: json.member,
    })
  }

  toJson(): Record<string, unknown> {
    return {
      order: this.order,
      positionName: this.positionName,
      member: this.member,
    }
  }
}
