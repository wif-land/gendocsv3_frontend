import * as Yup from 'yup'

import { enqueueSnackbar } from 'notistack'
import { IUser, UserRole } from '../../domain/entities/IUser'
import { UserUseCasesImpl } from '../../domain/usecases/UserService'
import { VALIDATION_MESSAGES } from '../../../../shared/utils/FormUtil'

export interface FormValuesProps extends IUser {}

export const TABLE_HEAD = [
  {
    id: 'name',
    label: 'Usuario',
  },
  {
    id: 'googleEmail',
    label: 'Email personal',
  },
  {
    id: 'outlookEmail',
    label: 'Email universitario',
  },
  {
    id: 'isActive',
    label: 'Estado',
  },
  {
    id: 'actions',
    label: 'Acciones',
  },
]

export const NewFunctionarySchema = Yup.object().shape({
  firstName: Yup.string().required(VALIDATION_MESSAGES.required),
  secondName: Yup.string(),
  firstLastName: Yup.string().required(VALIDATION_MESSAGES.required),
  secondLastName: Yup.string(),
  outlookEmail: Yup.string()
    .required(VALIDATION_MESSAGES.required)
    .matches(
      /^[A-Z0-9._%+-]+@uta\.edu\.ec$/i,
      VALIDATION_MESSAGES.invalidFormat,
    ),
  googleEmail: Yup.string()
    .required(VALIDATION_MESSAGES.required)
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      VALIDATION_MESSAGES.invalidFormat,
    ),
  password: Yup.string(),
  role: Yup.string().required(VALIDATION_MESSAGES.required),
  accessModules: Yup.array()
    .of(Yup.number())
    .required(VALIDATION_MESSAGES.required),
})

export const resolveDefaultValues = (currentUser?: IUser) => ({
  firstName: currentUser?.firstName || '',
  secondName: currentUser?.secondName || '',
  firstLastName: currentUser?.firstLastName || '',
  secondLastName: currentUser?.secondLastName || '',
  outlookEmail: currentUser?.outlookEmail || '',
  googleEmail: currentUser?.googleEmail || '',
  isActive: currentUser?.isActive || true,
  password: '',
  role: currentUser?.role || UserRole.ADMIN,
  accessModules: currentUser?.accessModules || [],
})

export const handleCreate = async (values: FormValuesProps) => {
  const result = await UserUseCasesImpl.getInstance().create(values)

  if (!result) {
    enqueueSnackbar('Error al crear el usuario', { variant: 'error' })
    return
  }

  enqueueSnackbar('Usuario creado con éxito', { variant: 'success' })
}

export const handleUpdate = async (
  id: number,
  values: Partial<IUser> | null,
) => {
  if (!values) {
    enqueueSnackbar('No se han encontrado valores para actualizar', {
      variant: 'warning',
    })
    return
  }

  const result = await UserUseCasesImpl.getInstance().update(id, values)

  if (!result) {
    enqueueSnackbar('Error al actualizar el usuario', {
      variant: 'error',
    })
    return
  }

  enqueueSnackbar('Usuario actualizado con éxito', { variant: 'success' })
}
