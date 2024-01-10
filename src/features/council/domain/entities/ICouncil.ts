export enum CouncilType {
  EXTRAORDINARY = 'EXTRAORDINARY',
  ORDINARY = 'ORDINARY',
}

export const CouncilTypeLabels = {
  [CouncilType.EXTRAORDINARY]: 'Extraordinaria',
  [CouncilType.ORDINARY]: 'Ordinaria',
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
  moduleId: number
  userId: number
}
