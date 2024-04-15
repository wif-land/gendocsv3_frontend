export interface IDefaultMembers {
  order: number
  positionName: string
  member: IMember
}

export interface IMember {
  dni: string
  firstName: string
  secondName: string
  firstLastName: string
  secondLastName: string
  isStudent: boolean
}
