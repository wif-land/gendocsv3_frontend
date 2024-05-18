import { FunctionaryModel } from '../../data/models/FunctionatyModel'
import {
  ICreateFunctionary,
  IUpdateFunctionary,
} from '../entities/IFunctionary'
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

  update: (data: IUpdateFunctionary) => Promise<FunctionaryModel>

  bulkUpdate: (data: IUpdateFunctionary[]) => Promise<FunctionaryModel[]>

  create: (data: ICreateFunctionary) => Promise<FunctionaryModel>
}
