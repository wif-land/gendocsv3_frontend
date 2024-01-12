import { ITemplate } from '../../../templates/domain/entities/ITemplate'

export interface IProcess {
  id?: number
  createdAt?: Date
  updatedAt?: Date
  name: string
  driveId?: string
  isActive: boolean
  userId: number
  moduleId: number
  submoduleYearModuleId?: number
  templateProcesses?: ITemplate[]
}
