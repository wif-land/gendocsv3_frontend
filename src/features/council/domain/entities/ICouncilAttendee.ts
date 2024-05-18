/* eslint-disable @typescript-eslint/no-explicit-any */

import { IMember } from '../../../default-members/domain/entities/IDefaultMembers'

export interface ICouncilAttendee {
  id?: number

  hasAttended: boolean

  hasBeenNotified: boolean

  isStudent: boolean

  member: IMember

  positionName: string

  positionOrder: number

  defaultMemberId: number
}
