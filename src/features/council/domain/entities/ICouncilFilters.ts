export interface ICouncilFilters {
  name?: string
  status?: boolean
  startDate?: Date | string
  endDate?: Date | string
  dateType?: DateType
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
