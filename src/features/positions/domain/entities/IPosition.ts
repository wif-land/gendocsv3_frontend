import { IFunctionary } from '../../../../features/functionaries/domain/entities/IFunctionary'

export interface IPosition {
  id?: number
  variable: string
  name: string
  functionary: IFunctionary | string
}
