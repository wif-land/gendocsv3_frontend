export interface ICouncilFilters {
  name?: string
  status?: boolean
  startDate?: Date
  endDate?: Date
  dateTyepe?: DATE_TYPES
}

enum DATE_TYPES {
  EJECUTION = 'EJECUTION',
  CREATION = 'CREATION',
}
