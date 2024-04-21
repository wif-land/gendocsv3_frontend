import { DefaultMemberModel } from '../../data/models/DefaultMembersModel'
import { DefaultMemberRepositoryImpl } from '../../data/repositories/DefaultMemberRepositoryImpl'
import { DefaultMemberRepository } from '../repositories/DefaultMemberRepository'

interface DefaultMembersUseCases {
  getByModuleId: (moduleId: number) => Promise<DefaultMemberModel[]>

  createOrEditByModuleId: (
    moduleId: number,
    defaultMembers: DefaultMemberModel[],
  ) => Promise<DefaultMemberModel[]>

  updateByModuleId: (
    moduleId: number,
    defaultMember: Partial<DefaultMemberModel>,
  ) => Promise<DefaultMemberModel>
}

export class DefaultMembersUseCasesImpl implements DefaultMembersUseCases {
  static instance: DefaultMembersUseCasesImpl

  static getInstance = (): DefaultMembersUseCasesImpl => {
    if (!DefaultMembersUseCasesImpl.instance) {
      DefaultMembersUseCasesImpl.instance = new DefaultMembersUseCasesImpl()
    }

    return DefaultMembersUseCasesImpl.instance
  }

  private defaultMemberRepository: DefaultMemberRepository =
    DefaultMemberRepositoryImpl.getInstance()

  getByModuleId = async (moduleId: number) =>
    await this.defaultMemberRepository.getByModuleId(moduleId)

  createOrEditByModuleId = async (
    moduleId: number,
    defaultMembers: DefaultMemberModel[],
  ) =>
    await this.defaultMemberRepository.createOrEditByModuleId(
      moduleId,
      defaultMembers,
    )

  updateByModuleId = async (
    moduleId: number,
    defaultMember: Partial<DefaultMemberModel>,
  ) =>
    await this.defaultMemberRepository.updateByModuleId(moduleId, defaultMember)
}
