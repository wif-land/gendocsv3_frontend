import { NotificationStatus } from '../../utils/notification-status'
import { CreatedBy } from './ICreatedBy'
import { Scope } from './IScope'

export interface INotification {
  name: string
  type: string
  status: NotificationStatus
  scope: Scope
  isMain: boolean
  createdBy: CreatedBy
  messages?: string[]
  data?: string
  retryId?: number
  parentId?: number
  id: number
  createdAt: string
  updatedAt: string
}
