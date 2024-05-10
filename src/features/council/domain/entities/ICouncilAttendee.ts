/* eslint-disable @typescript-eslint/no-explicit-any */

import { IMember } from '../../../../features/default-members/domain/entities/DefaultMembers'

export interface ICouncilAttendee {
  id?: number

  hasAttended: boolean

  hasBeenNotified: boolean

  isStudent: boolean

  member: IMember | string

  positionName: string

  positionOrder: number

  defaultMemberId: number
}
