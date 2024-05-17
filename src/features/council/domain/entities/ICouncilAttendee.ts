/* eslint-disable @typescript-eslint/no-explicit-any */

import { IFunctionary } from '../../../functionaries/domain/entities/IFunctionary'

export interface ICouncilAttendee {
  id?: number

  hasAttended: boolean

  hasBeenNotified: boolean

  isStudent: boolean

  member: any

  positionName: string

  positionOrder: number

  defaultMemberId: number

  functionary?: IFunctionary
}
