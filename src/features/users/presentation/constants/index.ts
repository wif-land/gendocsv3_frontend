import * as Yup from 'yup'

import { VALIDATION_MESSAGES } from '../../../../shared/utils/Messages'
import { enqueueSnackbar } from 'notistack'
import { IUser, UserRole } from '../../domain/entities/IUser'
import { UserUseCasesImpl } from '../../domain/usecases/UserService'

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
  dni: Yup.string().required(VALIDATION_MESSAGES.required),
  firstName: Yup.string().required(VALIDATION_MESSAGES.required),
  secondName: Yup.string().required(VALIDATION_MESSAGES.required),
  firstLastName: Yup.string().required(VALIDATION_MESSAGES.required),
  secondLastName: Yup.string().required(VALIDATION_MESSAGES.required),
  outlookEmail: Yup.string()
    .required(VALIDATION_MESSAGES.required)
    .matches(
      /^[A-Z0-9._%+-]+@uta\.edu\.ec$/i,
      VALIDATION_MESSAGES.invalidFormat,
    ),
  personalEmail: Yup.string()
    .required(VALIDATION_MESSAGES.required)
    .matches(
      /^[A-Z0-9._%+-]+@+[A-Z0-9._%+-]+\.com$/i,
      VALIDATION_MESSAGES.invalidFormat,
    ),
  phoneNumber: Yup.string().required(VALIDATION_MESSAGES.required),
  regularPhoneNumber: Yup.string().required(VALIDATION_MESSAGES.required),
  secondLevelDegree: Yup.string().required(VALIDATION_MESSAGES.required),
  thirdLevelDegree: Yup.string().required(VALIDATION_MESSAGES.required),
  fourthLevelDegree: Yup.string().required(VALIDATION_MESSAGES.required),
})

export const resolveDefaultValues = (currentFunctionary?: IUser) => ({
  firstName: currentFunctionary?.firstName || '',
  secondName: currentFunctionary?.secondName || '',
  firstLastName: currentFunctionary?.firstLastName || '',
  secondLastName: currentFunctionary?.secondLastName || '',
  outlookEmail: currentFunctionary?.outlookEmail || '',
  googleEmail: currentFunctionary?.googleEmail || '',
  isActive: currentFunctionary?.isActive || true,
  role: currentFunctionary?.role || UserRole.ADMIN,
  accessModules: currentFunctionary?.accessModules || [],
})

export const handleCreate = async (values: FormValuesProps) => {
  const result = await UserUseCasesImpl.getInstance().create(values)

  if (!result) {
    enqueueSnackbar('Error al crear el funcionario', { variant: 'error' })
    return
  }

  enqueueSnackbar('Funcionario creado con éxito', { variant: 'success' })
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
    enqueueSnackbar('Error al actualizar el funcionario', {
      variant: 'error',
    })
    return
  }

  enqueueSnackbar('Funcionario actualizado con éxito', { variant: 'success' })
}
