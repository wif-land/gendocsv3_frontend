import * as Yup from 'yup'
import { IDefaultMembersToCreate } from '../../domain/entities/DefaultMembers'

export const NewMemberSchema = Yup.object().shape({
  members: Yup.array()
    .of(
      Yup.object().shape({
        order: Yup.number().required('El orden es requerido'),
        positionName: Yup.string().required(
          'El nombre de la posición es requerido',
        ),
        member: Yup.mixed().required('El miembro es requerido'),
      }),
    )
    .required('Se requiere al menos un miembro'),
})

export const resolveDefaultValues = (
  defaultMembers?: IDefaultMembersToCreate,
) => {
  const defaultValues: Partial<IDefaultMembersToCreate> = {
    members: defaultMembers?.members.map((member) => ({
      order: member.order,
      positionName: member.positionName,
      member: member.member,
    })),
  }

  return defaultValues as IDefaultMembersToCreate
}
