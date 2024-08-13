import { PaginationDTO } from '../../../../shared/utils/pagination-dto'
import { FunctionaryModel } from '../../data/models/FunctionatyModel'
import {
  ICreateFunctionary,
  IUpdateFunctionary,
} from '../entities/IFunctionary'
import { IFunctionaryFilters } from '../entities/IFunctionaryFilters'

export interface FunctionaryRepository {
  getAll: (pagination?: PaginationDTO) => Promise<{
    count: number
    functionaries: FunctionaryModel[]
  }>

  getByFilters: (
    filters: IFunctionaryFilters,
    pagination?: PaginationDTO,
  ) => Promise<{
    count: number
    functionaries: FunctionaryModel[]
  }>

  update: (data: IUpdateFunctionary) => Promise<FunctionaryModel>

  bulkUpdate: (data: IUpdateFunctionary[]) => Promise<FunctionaryModel[]>

  create: (data: ICreateFunctionary) => Promise<FunctionaryModel>
}
