import * as Yup from 'yup'
import { IDefaultMembers } from '../../domain/entities/DefaultMembers'

export const NewDefaultMemberSchema = Yup.object().shape({
  positionName: Yup.string().required('El nombre de la posición es requerido'),
  member: Yup.mixed().required('El miembro es requerido'),
  isStudent: Yup.boolean().required('El tipo de miembro es requerido'),
})

export const resolveDefaultValues = (member?: IDefaultMembers) => ({
  positionName: member?.positionName || '',
  member: member?.member || '',
  isStudent: !!member?.isStudent,
})

export const ACTIONS = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
} as const
