import { UserRole } from '../../features/users/domain/entities/IUser'
import { PERMISSIONS } from '../constants/permissions'

export const checkUpdateInputPermission = (
  inputName: string,
  userRole: UserRole,
  modelName: string,
) => {
  const permissions = PERMISSIONS[userRole][modelName]

  if (permissions.UPDATE.includes('*')) return false
  return !permissions.UPDATE.includes(inputName)
}
