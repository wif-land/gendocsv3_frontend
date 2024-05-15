import { ICareer } from '../../../careers/domain/entities/ICareer'

export interface IDegCerTemplates {
  id: number
  code: string
  name: string
  driveId: string
  isActive: boolean
  certificateTypeCareers: ICertificateTypeCareer[]
  certificateTypeStatuses: ICertificateTypeStatuses[]
}

export interface ICertificateTypeCareer {
  id: number
  career: ICareer
}

export interface ICertificateTypeStatuses {
  id: number
  driveId: string
  certificateStatus: CertificateStatus
}

export interface CertificateStatus {
  id: number
  code: string
  maleName: string
  femaleName: string
  isActive: boolean
}
