import { IUser } from '../../../features/auth/domain/entities/IUser'
import { IRootNotification } from '../data/entities/IRootNotification'

export const filterByScope = (
  rootNotification: IRootNotification,
  user: IUser,
) => {
  let isAvailable = true

  if (!rootNotification.notification.scope) {
    return true
  }

  if (rootNotification.notification.scope.modules) {
    isAvailable = rootNotification.notification.scope.modules.some(
      (module) => user.accessModules?.includes(module),
    )
  }

  if (rootNotification.notification.scope.roles) {
    isAvailable =
      isAvailable &&
      user.role !== null &&
      user.role !== undefined &&
      rootNotification.notification.scope.roles.includes(user.role)
  }

  if (rootNotification.notification.scope.id) {
    isAvailable =
      isAvailable && rootNotification.notification.scope.id === user.id
  }

  return isAvailable
}
