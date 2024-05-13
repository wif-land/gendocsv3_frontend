export interface IDefaultMembers {
  positionOrder: number
  positionName: string
  member: IMember | string | IDefaultMembersToUpdate
  isStudent: boolean
}

export interface IMember {
  id?: number
  dni: string
  firstName: string
  secondName: string
  firstLastName: string
  secondLastName: string
  isStudent: boolean
}
export interface IDefaultMembersToUpdate {
  id: number
  label: string
}
