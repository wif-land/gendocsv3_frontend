export interface IDocument {
  id?: number
  number: number
  councilId: number
  createdAt?: Date
  driveId?: string
  userId: number
  userName?: string
  templateId: number
  studentId?: number
  functionariesIds?: number[]
  description: string
  variables?: string
  updatedAt?: Date
  studentNotified?: boolean
}
