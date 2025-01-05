/* eslint-disable @typescript-eslint/no-explicit-any */
import { ITemplate } from '../../domain/entities/ITemplate'

export class TemplateModel implements ITemplate {
  id?: number
  createdAt?: Date
  updatedAt?: Date
  name: string
  isActive: boolean
  driveId?: string
  hasStudent?: boolean
  hasFunctionary?: boolean
  userId: number
  userName?: string
  processId: number

  constructor({
    id,
    createdAt,
    updatedAt,
    name,
    isActive,
    driveId,
    hasStudent,
    hasFunctionary,
    userId,
    userName,
    processId,
  }: ITemplate) {
    this.id = id
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.name = name
    this.isActive = isActive
    this.driveId = driveId
    this.hasStudent = hasStudent
    this.hasFunctionary = hasFunctionary
    this.userId = userId
    this.userName = userName
    this.processId = processId
  }

  static fromJson(json: Record<string, any> | string): TemplateModel {
    if (typeof json === 'string') {
      return JSON.parse(json, TemplateModel.reviver)
    } else {
      const template = new TemplateModel({
        id: json.id,
        createdAt: json.createdAt,
        updatedAt: json.updatedAt,
        name: json.name,
        isActive: json.isActive,
        driveId: json.driveId,
        hasStudent: json.hasStudent,
        hasFunctionary: json.hasFunctionary,
        userId: json.userId,
        processId: json.processId,
      })

      return template
    }
  }

  static reviver(key: string, value: any): any {
    return key === '' ? new TemplateModel(value) : value
  }

  toJson(): ITemplate {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      name: this.name,
      isActive: this.isActive,
      driveId: this.driveId,
      hasStudent: this.hasStudent,
      hasFunctionary: this.hasFunctionary,
      userId: this.userId,
      processId: this.processId,
    }
  }
}
