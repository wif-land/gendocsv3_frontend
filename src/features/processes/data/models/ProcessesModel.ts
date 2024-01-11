/* eslint-disable @typescript-eslint/no-explicit-any */
import { IProcess } from '../../domain/entities/IProcess'

export class ProcessModel implements IProcess {
  id?: number
  createdAt?: Date
  updatedAt?: Date
  name: string
  driveId: string
  isActive: boolean
  userId: number
  moduleId: number
  submoduleYearModuleId: number

  constructor(props: IProcess) {
    this.id = props.id || undefined
    this.createdAt = props.createdAt
    this.updatedAt = props.createdAt
    this.name = props.name
    this.driveId = props.driveId
    this.isActive = props.isActive || true
    this.userId = props.userId
    this.moduleId = props.moduleId
    this.submoduleYearModuleId = props.submoduleYearModuleId
  }
  static fromJson(json: Record<string, any> | string): ProcessModel {
    if (typeof json === 'string') {
      return JSON.parse(json, ProcessModel.reviver)
    } else {
      const process = new ProcessModel({
        id: json.id,
        createdAt: json.createdAt,
        updatedAt: json.updatedAt,
        name: json.name,
        driveId: json.driveId,
        isActive: json.isActive,
        userId: json.userId,
        moduleId: json.moduleId,
        submoduleYearModuleId: json.submoduleYearModuleId,
      })

      return process
    }
  }

  static reviver(key: string, value: any): any {
    return key === '' ? new ProcessModel(value) : value
  }

  toJson(): IProcess {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      name: this.name,
      driveId: this.driveId,
      isActive: this.isActive,
      userId: this.userId,
      moduleId: this.moduleId,
      submoduleYearModuleId: this.submoduleYearModuleId,
    }
  }
}
