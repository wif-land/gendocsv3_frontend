import { INotification } from './INotification'

export interface IRootNotification {
  notification: INotification
  childs: INotification[]
}
