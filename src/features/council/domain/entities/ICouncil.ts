import { ICouncilAttendee } from './ICouncilAttendee'

export enum CouncilType {
  EXTRAORDINARY = 'EXTRAORDINARIA',
  ORDINARY = 'ORDINARIA',
}

export const CouncilTypeLabels = {
  [CouncilType.EXTRAORDINARY]: 'Extraordinaria',
  [CouncilType.ORDINARY]: 'Ordinaria',
}

export enum CouncilAttendanceRole {
  PRESIDENT = 'PRESIDENT',
  SUBROGATE = 'SUBROGATE',
  MEMBER = 'MEMBER',
}

export const COUNCIL_TYPES = Object.keys(CouncilType).map((key) => ({
  label: CouncilTypeLabels[CouncilType[key as keyof typeof CouncilType]],
  value: CouncilType[key as keyof typeof CouncilType],
}))

export interface ICouncil {
  id?: number
  createdAt?: Date
  updatedAt?: Date
  name: string
  isActive: boolean
  isArchived: boolean
  date: Date
  type: CouncilType
  moduleId: number
  userId: number
  members: ICouncilAttendee[]
  createdBy?: string
  recopilationDriveId?: string
  hasProcessedDocuments?: boolean
}

export interface ICreateCouncil
  extends Omit<ICouncil, 'id' | 'createdAt' | 'updatedAt' | 'members'> {
  members: {
    positionName: string
    member: number
    positionOrder: number
  }[]
}

export interface IUpdateCouncil extends Partial<ICreateCouncil> {
  id: number
  isActive: boolean
}

export interface ICouncilAttendeeFormValues extends ICouncilAttendee {
  id: number
  label: string
}

export interface ICouncilFormValues
  extends Omit<ICouncil, 'members' | 'moduleId' | 'userId'> {
  members: {
    [positionName: string]: ICouncilAttendeeFormValues & ICouncilAttendee
  }
  moduleId?: number
  userId?: number
}
