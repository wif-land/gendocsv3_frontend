export interface IDocument {
  id?: number
  number: number
  councilId: number
  councilName?: string
  createdAt?: Date
  driveId?: string
  userId: number
  userName?: string
  templateId: number
  templateName?: string
  studentId?: number
  studentName?: string
  functionariesIds?: number[]
  description: string
  variables?: string
  updatedAt?: Date
  studentNotified?: boolean
}
