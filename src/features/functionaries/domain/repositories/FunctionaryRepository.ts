import { FunctionaryModel } from '../../data/models/FunctionatyModel'
import { IFunctionary } from '../entities/IFunctionary'

export interface FunctionaryRepository {
  getAll: (
    limit: number,
    offset: number,
  ) => Promise<{
    status: number
    data: {
      count: number
      functionaries: FunctionaryModel[]
    }
  }>

  getByField: (
    field: string,
    limit: number,
    offset: number,
  ) => Promise<{
    status: number
    data: {
      count: number
      functionaries: FunctionaryModel[]
    }
  }>

  update: (data: Partial<IFunctionary>) => Promise<{
    status: number
    functionary: FunctionaryModel
  }>

  bulkUpdate: (data: Partial<IFunctionary>[]) => Promise<{
    status: number
    functionaries: FunctionaryModel[]
  }>

  create: (data: IFunctionary) => Promise<{
    status: number
    functionary: FunctionaryModel
  }>
}
