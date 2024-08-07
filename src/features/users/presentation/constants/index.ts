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
  firstName: Yup.string()
    .required(VALIDATION_MESSAGES.required)
    .matches(/^[A-Za-zñÑáéíóúÁÉÍÓÚüÜ]+$/, VALIDATION_MESSAGES.invalidFormat),
  secondName: Yup.string(),
  firstLastName: Yup.string()
    .required(VALIDATION_MESSAGES.required)
    .matches(/^[A-Za-zñÑáéíóúÁÉÍÓÚüÜ]+$/, VALIDATION_MESSAGES.invalidFormat),
  secondLastName: Yup.string(),
  outlookEmail: Yup.string()
    .required(VALIDATION_MESSAGES.required)
    .matches(/^[A-Z0-9._%+-]+@uta\.edu\.ec$/i, `Debe contener (uta.edu.ec)`),
  googleEmail: Yup.string()
    .required(VALIDATION_MESSAGES.required)
    .matches(/^[A-Z0-9._%+-]+@gmail\.com$/i, ` Debe contener (gmail.com)`),
  password: Yup.string(),
  role: Yup.string().required(VALIDATION_MESSAGES.required),
  accessModules: Yup.array().required(VALIDATION_MESSAGES.required),
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
  accessCareersDegCert: currentUser?.accessCareersDegCert || [],
})

export const handleCreate = async (values: FormValuesProps) =>
  await UserUseCasesImpl.getInstance().create({
    ...values,
    accessModules: values.accessModules.map((module) => module.id),
    accessCareersDegCert: values.accessCareersDegCert?.map(
      (career) => career.id,
    ),
  })

export const handleUpdate = async (values: Partial<IUser> | null) => {
  if (!values) {
    enqueueSnackbar('No se han encontrado valores para actualizar', {
      variant: 'warning',
    })

    return {}
  }
  return await UserUseCasesImpl.getInstance().update(values)
}
