import { CouncilModel } from '../models/CouncilModel'
import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { ICouncil } from '../../domain/entities/ICouncil'

export interface CouncilsDataSource {
  getAll(): Promise<{
    status: number
    councils: CouncilModel[]
  }>

  getAllCouncilsByModuleId(moduleId: number): Promise<{
    status: number
    councils: CouncilModel[]
  }>

  getById(id: number): Promise<{
    status: number
    council: CouncilModel
  }>

  update(council: Partial<ICouncil>): Promise<{
    status: number
  }>

  create(council: ICouncil): Promise<{
    status: number
    council: CouncilModel
  }>
}

export class CouncilsDataSourceImpl implements CouncilsDataSource {
  static instance: CouncilsDataSourceImpl

  static getInstance = (): CouncilsDataSourceImpl => {
    if (!CouncilsDataSourceImpl.instance) {
      CouncilsDataSourceImpl.instance = new CouncilsDataSourceImpl()
    }

    return CouncilsDataSourceImpl.instance
  }

  async getAllCouncilsByModuleId(
    moduleId: number,
  ): Promise<{ status: number; councils: CouncilModel[] }> {
    const result = await AxiosClient.get(API_ROUTES.COUNCILS.GET_ALL, {
      params: { moduleId },
    })

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, councils: [] as CouncilModel[] }
    }

    return { status, councils: data.content as CouncilModel[] }
  }

  create = async (council: CouncilModel) => {
    const result = await AxiosClient.post(API_ROUTES.COUNCILS.CREATE, council)

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, council: {} as CouncilModel }
    }

    return { status, council: data.content as CouncilModel }
  }

  getAll = async () => {
    const result = await AxiosClient.get(API_ROUTES.COUNCILS.GET_ALL)

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, councils: [] as CouncilModel[] }
    }

    return { status, councils: data.content as CouncilModel[] }
  }

  update = async (career: ICouncil) => {
    const { id, ...rest } = career

    const result = await AxiosClient.patch(
      API_ROUTES.COUNCILS.UPDATE.replace(':id', id?.toString() || ''),
      rest,
    )

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status }
    }

    return { status, council: data.content as CouncilModel }
  }

  getById = async (id: number) => {
    throw new Error(`Method not implemented.${id}`)
  }
}
