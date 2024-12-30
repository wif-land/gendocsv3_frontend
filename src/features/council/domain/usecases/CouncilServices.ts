import { enqueueSnackbar } from 'notistack'
import { resolveEditedFields } from '../../../../shared/utils/FormUtil'
import { CouncilModel } from '../../data/models/CouncilModel'
import { CouncilRepositoryImpl } from '../../data/repositories/CouncilRepositoryImpl'
import { ICouncil, ICouncilFormValues } from '../entities/ICouncil'
import { ICouncilFilters } from '../entities/ICouncilFilters'
import { CouncilRepository } from '../repositories/CouncilRepository'
import { ICouncilAttendee } from '../entities/ICouncilAttendee'
import { PaginationDTO } from '../../../../shared/utils/pagination-dto'

interface CouncilUseCases {
  create(council: ICouncilFormValues): Promise<CouncilModel>

  getAll(): Promise<{ councils: CouncilModel[]; count: number }>

  getByFilters(
    filters: ICouncilFilters,
    moduleId: number,
    pagination: PaginationDTO,
  ): Promise<{
    count: number
    councils: CouncilModel[]
  }>

  update(
    id: number,
    council: ICouncilFormValues,
    councilToUpdate: ICouncil,
  ): Promise<CouncilModel>

  getAllCouncilsByModuleId(
    moduleId: number,
    pagination?: PaginationDTO,
  ): Promise<{
    councils: CouncilModel[]
    count: number
  }>

  toggleCouncilStatus(councils: Partial<ICouncil>[]): Promise<CouncilModel[]>

  notifyMembers(payload: {
    members: ICouncilAttendee[]
    councilId: number
  }): Promise<void>

  getById(id: number): Promise<CouncilModel>

  getNextNumberAvailable(moduleId: number): Promise<number>

  getCouncilsThatCanReserve(moduleId: number): Promise<CouncilModel[]>

  reserveNumeration(payload: {
    councilId: number
    start?: number
    end?: number
    isExtension?: boolean
  }): Promise<void>

  getAvailableExtensionNumeration(councilId: number): Promise<{
    start: number
    end: number
    actualStart: number
    actualEnd: number
  }>
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
    members: ICouncilAttendee[]
    councilId: number
  }): Promise<void> {
    await this.councilRepository.notifyMembers({
      members: payload.members.map((member) => ({
        email: member.member.outlookEmail,
        positionName: member.positionName as string,
        name: `${member.member.firstName} ${member.member.firstLastName}`,
        id: member.id as number,
      })),
      councilId: payload.councilId,
    })
  }

  getAll = async () => await this.councilRepository.getAll()

  getByFilters = async (
    filters: ICouncilFilters,
    moduleId: number,
    pagination: PaginationDTO,
  ) => await this.councilRepository.getByFilters(filters, moduleId, pagination)

  update = async (
    id: number,
    data: ICouncilFormValues,
    councilToUpdate: ICouncil,
  ) => {
    const editedFields = resolveEditedFields<ICouncilFormValues>(
      {
        ...councilToUpdate,
        members: Object.fromEntries(
          Object.entries(councilToUpdate.members).map(
            ([positionName, member]) => [
              {
                positionName,
                member: member.member.id,
                label: `${member.member.firstName} ${member.member.firstLastName}`,
                positionOrder: member.positionOrder,
              },
            ],
          ),
        ),
      },
      data,
    )

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
    pagination?: PaginationDTO,
  ) =>
    await this.councilRepository.getAllCouncilsByModuleId(moduleId, pagination)

  toggleCouncilStatus = async (councils: Partial<ICouncil>[]) =>
    await this.councilRepository.bulkUpdate(councils)

  getNextNumberAvailable = async (moduleId: number) =>
    await this.councilRepository.getNextNumberAvailable(moduleId)

  getCouncilsThatCanReserve = async (moduleId: number) =>
    await this.councilRepository.getCouncilsThatCanReserve(moduleId)

  reserveNumeration = async (payload: {
    councilId: number
    start?: number
    end?: number
    isExtension?: boolean
  }) => await this.councilRepository.reserveNumeration(payload)

  getAvailableExtensionNumeration = async (councilId: number) =>
    await this.councilRepository.getAvailableExtensionNumeration(councilId)

  setAttendance = async (councilAttendee: number) =>
    await this.councilRepository.setAttendance(councilAttendee)
}
