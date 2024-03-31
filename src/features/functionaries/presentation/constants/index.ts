import * as Yup from 'yup'

import { IFunctionary } from '../../domain/entities/IFunctionary'
import { enqueueSnackbar } from 'notistack'
import { FunctionaryUseCasesImpl } from '../../domain/usecases/FunctionaryServices'
import { VALIDATION_MESSAGES } from '../../../../shared/utils/FormUtil'

export interface FormValuesProps extends IFunctionary {}

export const TABLE_HEAD = [
  {
    id: 'name',
    label: 'Funcionario',
  },
  {
    id: 'personalEmail',
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

export const resolveDefaultValues = (currentFunctionary?: IFunctionary) => ({
  dni: currentFunctionary?.dni || '',
  firstName: currentFunctionary?.firstName || '',
  secondName: currentFunctionary?.secondName || '',
  firstLastName: currentFunctionary?.firstLastName || '',
  secondLastName: currentFunctionary?.secondLastName || '',
  outlookEmail: currentFunctionary?.outlookEmail || '',
  personalEmail: currentFunctionary?.personalEmail || '',
  phoneNumber: currentFunctionary?.phoneNumber || '',
  regularPhoneNumber: currentFunctionary?.regularPhoneNumber || '',
  secondLevelDegree: currentFunctionary?.secondLevelDegree || '',
  thirdLevelDegree: currentFunctionary?.thirdLevelDegree || '',
  fourthLevelDegree: currentFunctionary?.fourthLevelDegree || '',
  isActive: currentFunctionary?.isActive || true,
})

export const handleCreate = async (values: FormValuesProps) => {
  const result = await FunctionaryUseCasesImpl.getInstance().create(values)

  if (!result) {
    enqueueSnackbar('Error al crear el funcionario', { variant: 'error' })
    return
  }

  enqueueSnackbar('Funcionario creado con éxito', { variant: 'success' })
}

export const handleUpdate = async (
  id: number,
  values: Partial<IFunctionary> | null,
) => {
  if (!values) {
    enqueueSnackbar('No se han encontrado valores para actualizar', {
      variant: 'warning',
    })
    return
  }

  const result = await FunctionaryUseCasesImpl.getInstance().update(id, values)

  if (!result) {
    enqueueSnackbar('Error al actualizar el funcionario', {
      variant: 'error',
    })
    return
  }

  enqueueSnackbar('Funcionario actualizado con éxito', { variant: 'success' })
}
