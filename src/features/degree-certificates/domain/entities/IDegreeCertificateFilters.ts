export interface IDegreeCertificateFilters {
  careerId?: number
  field?: string
  startDate?: Date | undefined
  endDate?: Date | undefined
  isReport?: boolean
  isEnd?: boolean
  order?: 'ASC' | 'DESC'
}
