import * as Yup from 'yup'

import { VALIDATION_MESSAGES } from '../../../../shared/utils/Messages'
import { IPosition } from '../../domain/entities/IPosition'
import { enqueueSnackbar } from 'notistack'
import { PositionUseCasesImpl } from '../../domain/usecases/PositionServices'

export interface FormValuesProps extends IPosition {}

export const TABLE_HEAD = [
  {
    id: 'variable',
    label: 'Variable',
  },
  {
    id: 'name',
    label: 'Nombre',
  },
  {
    id: 'functionaryId',
    label: 'Funcionario',
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

export const resolveDefaultValues = (currentFunctionary?: IPosition) => ({
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
  const result = await PositionUseCasesImpl.getInstance().create(values)

  if (!result) {
    enqueueSnackbar('Error al crear el funcionario', { variant: 'error' })
    return
  }

  enqueueSnackbar('Funcionario creado con éxito', { variant: 'success' })
}

export const handleUpdate = async (
  id: number,
  values: Partial<IPosition> | null,
) => {
  if (!values) {
    enqueueSnackbar('No se han encontrado valores para actualizar', {
      variant: 'warning',
    })
    return
  }

  const result = await PositionUseCasesImpl.getInstance().update(id, values)

  if (!result) {
    enqueueSnackbar('Error al actualizar el funcionario', {
      variant: 'error',
    })
    return
  }

  enqueueSnackbar('Funcionario actualizado con éxito', { variant: 'success' })
}
