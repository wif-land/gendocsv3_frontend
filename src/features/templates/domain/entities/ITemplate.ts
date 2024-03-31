export interface ITemplate {
  id?: number
  createdAt?: Date
  updatedAt?: Date
  name: string
  isActive: boolean
  driveId?: string
  hasStudent?: boolean
  hasFunctionary?: boolean
  userId: number
  processId: number
}
