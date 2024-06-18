import { INotification } from '../../data/entities/INotification'
import { IRootNotification } from '../../data/entities/IRootNotification'

export class RootNotificationModel implements IRootNotification {
  notification: INotification
  childs: INotification[]

  constructor(data: IRootNotification) {
    this.notification = data.notification
    this.childs = data.childs
  }

  static fromJson(json: Record<string, never>) {
    return new RootNotificationModel({
      notification: json.notification,
      childs: json.childs,
    })
  }
}
