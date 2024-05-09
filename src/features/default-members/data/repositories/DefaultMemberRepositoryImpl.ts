import { DefaultMemberRepository } from '../../domain/repositories/DefaultMemberRepository'
import {
  DefaultMembersDataSource,
  DefaultMembersDataSourceImpl,
} from '../datasources/DefaultMembersDatasource'
import { DefaultMemberModel } from '../models/DefaultMembersModel'

export class DefaultMemberRepositoryImpl implements DefaultMemberRepository {
  static instance: DefaultMemberRepositoryImpl

  static getInstance = (): DefaultMemberRepositoryImpl => {
    if (!DefaultMemberRepositoryImpl.instance) {
      DefaultMemberRepositoryImpl.instance = new DefaultMemberRepositoryImpl(
        DefaultMembersDataSourceImpl.getInstance(),
      )
    }

    return DefaultMemberRepositoryImpl.instance
  }

  private constructor(private readonly datasource: DefaultMembersDataSource) {}

  getByModuleId = async (moduleId: number) =>
    await this.datasource.getByModuleId(moduleId)

  createOrEditByModuleId = async (
    moduleId: number,
    defaultMembers: DefaultMemberModel[],
  ) => await this.datasource.createByModuleId(moduleId, defaultMembers)

  updateByModuleId = async (
    moduleId: number,
    defaultMember: Partial<DefaultMemberModel>,
  ) => await this.datasource.updateByModuleId(moduleId, defaultMember)
}
