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
  ...DEFAULT_PERSON_SCHEMA.fields,
  regularPhoneNumber: Yup.string().required(VALIDATION_MESSAGES.required),
  thirdLevelDegree: Yup.string().required(VALIDATION_MESSAGES.required),
  fourthLevelDegree: Yup.string().required(VALIDATION_MESSAGES.required),
})

export const resolveDefaultValues = (
  currentFunctionary?: IFunctionary,
): IFunctionaryFormValues => ({
  ...resolveDefaultSchema(currentFunctionary),
  regularPhoneNumber: currentFunctionary?.regularPhoneNumber || '',
  thirdLevelDegree: (currentFunctionary?.thirdLevelDegree as IDegree)?.id || 0,
  fourthLevelDegree:
    (currentFunctionary?.fourthLevelDegree as IDegree)?.id || 0,
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
