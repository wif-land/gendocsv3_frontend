import { FunctionaryModel } from '../../data/models/FunctionatyModel'
import { IFunctionary } from '../entities/IFunctionary'

export interface FunctionaryRepository {
  getAll: () => Promise<{
    status: number
    functionaries: FunctionaryModel[]
  }>

  update: (data: Partial<IFunctionary>) => Promise<{
    status: number
  }>

  create: (data: IFunctionary) => Promise<{
    status: number
    functionary: FunctionaryModel
  }>
}
