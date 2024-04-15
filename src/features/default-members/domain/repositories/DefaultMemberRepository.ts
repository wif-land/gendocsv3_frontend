import { DefaultMemberModel } from '../../data/models/DefaultMembersModel'

export interface DefaultMemberRepository {
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
