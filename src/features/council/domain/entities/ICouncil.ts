export enum CouncilType {
  EXTRAORDINARY = 'EXTRAORDINARY',
  ORDINARY = 'ORDINARY',
}

export const CouncilTypeLabels = {
  [CouncilType.EXTRAORDINARY]: 'Extraordinaria',
  [CouncilType.ORDINARY]: 'Ordinaria',
}

export const COUNCIL_TYPES = Object.keys(CouncilType).map((key) => ({
  label: CouncilTypeLabels[key as keyof typeof CouncilType],
  value: key,
}))

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