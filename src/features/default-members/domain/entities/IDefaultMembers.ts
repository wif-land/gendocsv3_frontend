export interface IDefaultMembers {
  positionOrder: number
  positionName: string
  member: IMember | string | IDefaultMembersToUpdate
  isStudent: boolean
}

export interface ICreateDefaultMembers extends IDefaultMembers {
  member: IDefaultMembersToUpdate
}

export interface IUpdateDefaultMembers extends Partial<IDefaultMembers> {
  id: number
}

export interface IDefaultMembersFormValues
  extends Omit<IDefaultMembers, 'member'> {
  member: IMember
}

export interface IMember {
  id?: number
  dni: string
  firstName: string
  secondName?: string | null
  firstLastName: string
  secondLastName?: string | null
  isStudent: boolean
  outlookEmail: string
}

export interface IDefaultMembersToUpdate {
  id: number
  label: string
}
