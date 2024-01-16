export interface IDocument {
  id?: number
  createdAt?: Date
  updatedAt?: Date
  description: string
  studentNotified: boolean
  driveId: string
  studentId: number
  userId: number
  numerationDocumentId: number
}
