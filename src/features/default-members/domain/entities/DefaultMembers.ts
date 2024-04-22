export interface IDefaultMembers {
  positionOrder: number
  positionName: string
  member: IMember | string
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

// PENSÉ EN CREAR UNA INTERFAZ PARA LOS MIEMBROS POR DEFECTO, PERO NO SE SI SEA NECESARIO
export interface IDefaultMembersToCreate {
  members: IDefaultMembers[]
}
