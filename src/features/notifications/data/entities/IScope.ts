import { UserRole } from '../../../../features/users/domain/entities/IUser'

export interface Scope {
  modules?: number[]
  roles?: UserRole[]
  id?: number
}
