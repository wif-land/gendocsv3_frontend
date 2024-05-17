import { DefaultMemberModel } from '../../data/models/DefaultMembersModel'

export interface DefaultMemberRepository {
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
