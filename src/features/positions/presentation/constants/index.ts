import * as Yup from 'yup'

import { IPosition } from '../../domain/entities/IPosition'
import { enqueueSnackbar } from 'notistack'
import { PositionUseCasesImpl } from '../../domain/usecases/PositionServices'
import { IFunctionary } from '../../../../features/functionaries/domain/entities/IFunctionary'
import { VALIDATION_MESSAGES } from '../../../../shared/utils/FormUtil'

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
  {
    id: 'actions',
    label: 'Acciones',
  },
]

export const NewFunctionarySchema = Yup.object().shape({
  name: Yup.string().required(VALIDATION_MESSAGES.required),
  variable: Yup.string().required(VALIDATION_MESSAGES.required),
  functionary: Yup.string().required(VALIDATION_MESSAGES.required),
})

export const resolveDefaultValues = (currentPosition?: IPosition) => ({
  name: currentPosition?.name || '',
  variable: currentPosition?.variable.replace(/{{|}}/g, '') || '',
  functionary: currentPosition?.functionary
    ? getSelectedFunctionary(currentPosition?.functionary as IFunctionary)
    : '',
})

export const getSelectedFunctionary = (currentFunctionary?: IFunctionary) =>
  ` ${currentFunctionary?.firstName} ${currentFunctionary?.secondName} ${currentFunctionary?.firstLastName} ${currentFunctionary?.secondLastName} - ${currentFunctionary?.dni}`

export const handleCreate = async (values: FormValuesProps) => {
  const functionaryDni = (values.functionary as string).split('-')[1].trim()
  const result = await PositionUseCasesImpl.getInstance().create({
    ...values,
    variable: `{{${values.variable.toUpperCase()}}}`,
    functionary: functionaryDni,
  })

  if (!result) {
    enqueueSnackbar('Error al crear el cargo', { variant: 'error' })
    return
  }

  enqueueSnackbar('Cargo creado con éxito', { variant: 'success' })
}

export const handleUpdate = async (values: Partial<IPosition> | null) => {
  if (!values) {
    enqueueSnackbar('No se han encontrado valores para actualizar', {
      variant: 'warning',
    })
    return
  }

  let functionaryDni
  let newVariable

  if (values.functionary) {
    functionaryDni = (values.functionary as string).split('-')[1].trim()
  }

  if (values.variable) {
    newVariable = `{{${values.variable.toUpperCase()}}}`
  }

  const result = await PositionUseCasesImpl.getInstance().update({
    ...values,
    variable: newVariable,
    functionary: functionaryDni,
  })

  if (!result) {
    enqueueSnackbar('Error al actualizar el funcionario', {
      variant: 'error',
    })
    return
  }

  enqueueSnackbar('Funcionario actualizado con éxito', { variant: 'success' })
}
