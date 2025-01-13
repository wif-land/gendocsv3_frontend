/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup'

import {
  IFunctionary,
  IFunctionaryFormValues,
} from '../../domain/entities/IFunctionary'
import { enqueueSnackbar } from 'notistack'
import { FunctionaryUseCasesImpl } from '../../domain/usecases/FunctionaryServices'
import {
  DEFAULT_PERSON_SCHEMA,
  VALIDATION_MESSAGES,
  resolveDefaultSchema,
} from '../../../../shared/utils/FormUtil'
import { FunctionaryModel } from '../../data/models/FunctionatyModel'
import { IDegree } from '../../../../core/providers/domain/entities/IDegreeProvider'

export interface FormValuesProps extends IFunctionary {}

export const TABLE_HEAD = [
  {
    id: 'name',
    label: 'Funcionario',
  },
  {
    id: 'outlookEmail',
    label: 'Email universitario',
  },
  {
    id: 'personalEmail',
    label: 'Email personal',
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
  ...DEFAULT_PERSON_SCHEMA.fields,
  thirdLevelDegree: Yup.number().required(VALIDATION_MESSAGES.required),
  fourthLevelDegree: Yup.number().nullable(),
})

export const resolveDefaultValues = (
  currentFunctionary?: IFunctionary,
): IFunctionaryFormValues => ({
  ...resolveDefaultSchema(currentFunctionary),
  regularPhoneNumber: currentFunctionary?.regularPhoneNumber || '',
  thirdLevelDegree:
    (currentFunctionary?.thirdLevelDegree as IDegree)?.id || (null as any),
  fourthLevelDegree:
    (currentFunctionary?.fourthLevelDegree as IDegree)?.id || (null as any),
  isActive: currentFunctionary?.isActive || true,
})

export const handleCreate = async (values: IFunctionaryFormValues) =>
  await FunctionaryUseCasesImpl.getInstance().create(values)

export const handleUpdate = async (
  id: number,
  values: Partial<IFunctionaryFormValues>,
) => {
  if (!values) {
    enqueueSnackbar('No se han encontrado valores para actualizar', {
      variant: 'warning',
    })

    return FunctionaryModel.fromJson({})
  }

  return await FunctionaryUseCasesImpl.getInstance().update(id, values)
}
