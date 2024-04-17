import { FunctionaryModel } from '../../data/models/FunctionatyModel'
import { IFunctionary } from '../entities/IFunctionary'
import { IFunctionaryFilters } from '../entities/IFunctionaryFilters'

export interface FunctionaryRepository {
  getAll: (
    limit: number,
    offset: number,
  ) => Promise<{
    count: number
    functionaries: FunctionaryModel[]
  }>

  getByFilters: (
    filters: IFunctionaryFilters,
    limit: number,
    offset: number,
  ) => Promise<{
    count: number
    functionaries: FunctionaryModel[]
  }>

  update: (data: Partial<IFunctionary>) => Promise<FunctionaryModel>

  bulkUpdate: (data: Partial<IFunctionary>[]) => Promise<FunctionaryModel[]>

  create: (data: IFunctionary) => Promise<FunctionaryModel>
}
