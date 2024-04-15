import { DefaultMemberModel } from '../../data/models/DefaultMembersModel'
import { DefaultMemberRepositoryImpl } from '../../data/repositories/DefaultMemberRepositoryImpl'
import { DefaultMemberRepository } from '../repositories/DefaultMemberRepository'

interface DefaultMembersUseCases {
  getByModuleId: (moduleId: number) => Promise<DefaultMemberModel[]>

  createByModuleId: (
    moduleId: number,
    defaultMember: DefaultMemberModel,
  ) => Promise<DefaultMemberModel>

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

  private councilRepository: DefaultMemberRepository =
    DefaultMemberRepositoryImpl.getInstance()

  getByModuleId = async (moduleId: number) =>
    await this.councilRepository.getByModuleId(moduleId)

  createByModuleId = async (
    moduleId: number,
    defaultMember: DefaultMemberModel,
  ) => await this.councilRepository.createByModuleId(moduleId, defaultMember)

  updateByModuleId = async (
    moduleId: number,
    defaultMember: Partial<DefaultMemberModel>,
  ) => await this.councilRepository.updateByModuleId(moduleId, defaultMember)
}
