export interface ICertificateStatus {
  id: number
  code: string
  maleName: string
  femaleName: string
  isActive: boolean
}

export interface ICertificateType {
  id: number
  code: string
  name: string
  driveId: string
  isActive: boolean
}

export interface IDegreeModality {
  id: number
  code: string
  name: string
  isActive: boolean
}

export interface IRoom {
  id: number
  name: string
  isActive: boolean
}
