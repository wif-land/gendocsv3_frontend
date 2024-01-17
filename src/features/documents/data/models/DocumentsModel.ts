/* eslint-disable @typescript-eslint/no-explicit-any */
import { IDocument } from '../../domain/entities/IDocument'

export class DocumentModel implements IDocument {
  id?: number
  number: number
  councilId: number
  createdAt?: Date
  driveId?: string
  userId: number
  templateId: number
  studentId?: number
  functionariesIds?: number[]
  description: string
  variables?: string
  updatedAt?: Date
  studentNotified?: boolean

  constructor(props: IDocument) {
    this.id = props.id
    this.number = props.number
    this.councilId = props.councilId
    this.createdAt = props.createdAt
    this.driveId = props.driveId
    this.userId = props.userId
    this.templateId = props.templateId
    this.studentId = props.studentId
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
      const process = new DocumentModel({
        id: json.id,
        number: json.number,
        councilId: json.councilId,
        createdAt: json.createdAt,
        driveId: json.driveId,
        userId: json.userId,
        templateId: json.templateId,
        studentId: json.studentId,
        functionariesIds: json.functionariesIds,
        description: json.description,
        variables: json.variables,
        updatedAt: json.updatedAt,
        studentNotified: json.studentNotified,
      })

      return process
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
