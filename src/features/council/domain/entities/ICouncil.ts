export enum CouncilType {
  EXTRAORDINARY = 'EXTRAORDINARY',
  ORDINARY = 'ORDINARY',
}

export interface ICouncil {
  id?: number
  createdAt?: Date
  updatedAt?: Date
  name: string
  isActive: boolean
  isArchived: boolean
  date: Date
  type: CouncilType
}
