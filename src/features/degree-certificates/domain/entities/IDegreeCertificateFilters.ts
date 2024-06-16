export interface IDegreeCertificateFilters {
  careerId?: number
  field?: string
  startDate?: Date | undefined
  endDate?: Date | undefined
  dateType?: DateType
  isReport?: boolean
  isEnd?: boolean
}

export enum DateType {
  EJECUTION = 'EJECUTION',
  CREATION = 'CREATION',
}

export const DateTypeLabels = {
  [DateType.EJECUTION]: 'Ejecución',
  [DateType.CREATION]: 'Creación',
}

export const DATE_TYPES = Object.keys(DateType).map((key) => ({
  label: DateTypeLabels[key as keyof typeof DateType],
  value: key,
}))
