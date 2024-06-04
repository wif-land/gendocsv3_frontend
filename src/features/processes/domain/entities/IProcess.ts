import { ITemplate } from '../../../templates/domain/entities/ITemplate'

export interface IProcess {
  id?: number
  createdAt?: Date
  updatedAt?: Date
  name: string
  driveId?: string
  userId?: number
  moduleId?: number
  isActive: boolean
  submoduleYearModuleId?: number
  templateProcesses?: ITemplate[]
}

export interface ICreateProcess extends Omit<IProcess, 'id'> {
  userId: number
  moduleId: number
}

export interface IUpdateProcess extends ICreateProcess {}

export interface IProcessFormValues extends IProcess {
  userId: number
}
