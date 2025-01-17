/* eslint-disable @typescript-eslint/no-explicit-any */
import { IDocument } from '../../domain/entities/IDocument'

export class DocumentModel implements IDocument {
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

  constructor(props: IDocument) {
    this.id = props.id
    this.number = props.number
    this.councilId = props.councilId
    this.councilName = props.councilName
    this.createdAt = props.createdAt
    this.driveId = props.driveId
    this.userId = props.userId
    this.userName = props.userName
    this.templateId = props.templateId
    this.templateName = props.templateName
    this.studentId = props.studentId
    this.studentName = props.studentName
    this.functionariesIds = props.functionariesIds
    this.description = props.description
    this.variables = props.variables
    this.updatedAt = props.updatedAt
    this.studentNotified = props.studentNotified
  }

  static fromJson(json: Record<string, any> | string): DocumentModel {
    if (typeof json === 'string') {
      return JSON.parse(json, DocumentModel.reviver)
    } else {
      return new DocumentModel({
        id: json.id,
        number: json.number,
        councilId: json.councilId,
        createdAt: json.createdAt,
        driveId: json.driveId,
        userId: json.userId,
        userName: json.userName,
        templateId: json.templateId,
        studentId: json.student?.id,
        functionariesIds: json.functionariesIds?.map(
          (data: { id: any; label: string }) => data.id,
        ),
        description: json.description,
        variables: json.variables,
        updatedAt: json.updatedAt,
        studentNotified: json.studentNotified,
      })
    }
  }

  static reviver(key: string, value: any): any {
    return key === '' ? new DocumentModel(value) : value
  }

  toJson(): IDocument {
    return {
      id: this.id,
      number: this.number,
      councilId: this.councilId,
      createdAt: this.createdAt,
      driveId: this.driveId,
      userId: this.userId,
      templateId: this.templateId,
      studentId: this.studentId,
      functionariesIds: this.functionariesIds,
      description: this.description,
      variables: this.variables,
      updatedAt: this.updatedAt,
      studentNotified: this.studentNotified,
    }
  }
}
