import { enqueueSnackbar } from 'notistack'
import { resolveEditedFields } from '../../../../shared/utils/FormUtil'
import { CouncilModel } from '../../data/models/CouncilModel'
import { CouncilRepositoryImpl } from '../../data/repositories/CouncilRepositoryImpl'
import { ICouncil, ICouncilFormValues } from '../entities/ICouncil'
import { ICouncilFilters } from '../entities/ICouncilFilters'
import { CouncilRepository } from '../repositories/CouncilRepository'

interface CouncilUseCases {
  create(council: ICouncilFormValues): Promise<CouncilModel>

  getAll(): Promise<CouncilModel[]>

  getByFilters(
    filters: ICouncilFilters,
    moduleId: number,
    limit: number,
    offset: number,
  ): Promise<{
    count: number
    councils: CouncilModel[]
  }>

  update(id: number, council: ICouncilFormValues): Promise<CouncilModel>

  getAllCouncilsByModuleId(
    moduleId: number,
    limit: number,
    offset: number,
  ): Promise<{
    councils: CouncilModel[]
    count: number
  }>

  toggleCouncilStatus(councils: Partial<ICouncil>[]): Promise<CouncilModel[]>

  notifyMembers(payload: { members: number[] }): Promise<void>

  getById(id: number): Promise<CouncilModel>

  getNextNumberAvailable(moduleId: number): Promise<number>

  getCouncilsThatCanReserve(moduleId: number): Promise<CouncilModel[]>

  reserveNumeration(payload: {
    councilId: number
    start: number
    end: number
  }): Promise<void>
}

export class CouncilsUseCasesImpl implements CouncilUseCases {
  static instance: CouncilsUseCasesImpl

  static getInstance = (): CouncilsUseCasesImpl => {
    if (!CouncilsUseCasesImpl.instance) {
      CouncilsUseCasesImpl.instance = new CouncilsUseCasesImpl()
    }

    return CouncilsUseCasesImpl.instance
  }

  private councilRepository: CouncilRepository =
    CouncilRepositoryImpl.getInstance()

  create = async (data: ICouncilFormValues) => {
    const values = {
      ...data,
      members: Object.entries(data.members).map(([positionName, member]) => ({
        positionName,
        member: member.id,
        positionOrder: member.positionOrder,
      })),
      moduleId: data.moduleId as number,
      userId: data.userId as number,
    }

    return await this.councilRepository.create(values)
  }

  async getById(id: number): Promise<CouncilModel> {
    return await this.councilRepository.getById(id)
  }

  async notifyMembers(payload: {
    members: number[]
    id: number
  }): Promise<void> {
    const { members } = payload

    await this.councilRepository.notifyMembers({
      id: payload.id,
      members,
    })
  }

  getAll = async () => await this.councilRepository.getAll()

  getByFilters = async (
    filters: ICouncilFilters,
    moduleId: number,
    limit = 5,
    offset = 0,
  ) =>
    await this.councilRepository.getByFilters(filters, moduleId, limit, offset)

  update = async (id: number, data: ICouncilFormValues) => {
    const editedFields = resolveEditedFields<ICouncilFormValues>(data, data)

    if (!editedFields) {
      enqueueSnackbar('No se encontraron cambios a realizar', {
        variant: 'info',
      })

      return CouncilModel.fromJson({})
    }

    const values = {
      ...editedFields,
      id,
      members: Object.entries(editedFields.members).map(
        ([positionName, member]) => ({
          positionName,
          member: member.id,
          positionOrder: member.positionOrder,
        }),
      ),
    }

    return await this.councilRepository.update(values)
  }

  getAllCouncilsByModuleId = async (
    moduleId: number,
    limit: number,
    offset: number,
  ) =>
    await this.councilRepository.getAllCouncilsByModuleId(
      moduleId,
      limit,
      offset,
    )

  toggleCouncilStatus = async (councils: Partial<ICouncil>[]) =>
    await this.councilRepository.bulkUpdate(councils)

  getNextNumberAvailable = async (moduleId: number) =>
    await this.councilRepository.getNextNumberAvailable(moduleId)

  getCouncilsThatCanReserve = async (moduleId: number) =>
    await this.councilRepository.getCouncilsThatCanReserve(moduleId)

  reserveNumeration = async (payload: {
    councilId: number
    start: number
    end: number
  }) => await this.councilRepository.reserveNumeration(payload)
}
