import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { DefaultMemberModel } from '../models/DefaultMembersModel'

export interface DefaultMembersDataSource {
  getByModuleId: (moduleId: number) => Promise<DefaultMemberModel[]>

  createByModuleId: (
    moduleId: number,
    defaultMembers: DefaultMemberModel[],
  ) => Promise<DefaultMemberModel[]>

  updateByModuleId: (
    moduleId: number,
    defaultMember: Partial<DefaultMemberModel>,
  ) => Promise<DefaultMemberModel>
}

export class DefaultMembersDataSourceImpl implements DefaultMembersDataSource {
  static instance: DefaultMembersDataSourceImpl

  static getInstance = (): DefaultMembersDataSourceImpl => {
    if (!DefaultMembersDataSourceImpl.instance) {
      DefaultMembersDataSourceImpl.instance = new DefaultMembersDataSourceImpl()
    }

    return DefaultMembersDataSourceImpl.instance
  }

  getByModuleId = async (moduleId: number) => {
    const response = await AxiosClient.get(
      API_ROUTES.ATTENDANCE.GET_DEFAULT_MEMBERS_BY_MODULE_ID(moduleId),
    )

    if ('error' in response) {
      return []
    }

    return response.data as DefaultMemberModel[]
  }

  createByModuleId = async (
    moduleId: number,
    defaultMembers: DefaultMemberModel[],
  ) => {
    const response = await AxiosClient.post(
      API_ROUTES.ATTENDANCE.EDIT_CREATE_DEFAULT_MEMBERS_BY_MODULE_ID(moduleId),
      defaultMembers,
    )

    if ('error' in response) {
      return []
    }

    return response.data as DefaultMemberModel[]
  }

  updateByModuleId = async (
    moduleId: number,
    defaultMember: Partial<DefaultMemberModel>,
  ) => {
    // try {
    //   const response = await AxiosClient.put(
    //     `${API_ROUTES.DEFAULT_MEMBERS}/module/${moduleId}`,
    //     defaultMember,
    //   )
    //   return response.data
    // } catch (error) {
    //   throw error
    // }

    throw new Error(`Method not implemented ${moduleId} ${defaultMember}`)
  }
}
