import * as Yup from 'yup'

import { IProcess, IProcessFormValues } from '../../domain/entities/IProcess'
import { IProcessTableFilters } from '../components/ProcessTableToolbar'
import { VALIDATION_MESSAGES } from '../../../../shared/utils/FormUtil'

export const TABLE_HEAD = [
  { id: 'name', label: 'Proceso' },
  { id: 'isActive', label: 'Estado', width: 140 },
  { id: 'actions', label: 'Acciones', width: 110 },
]

export const defaultFilters: IProcessTableFilters = {
  field: undefined,
  state: undefined,
}

export const NewProcessSchema = Yup.object().shape({
  name: Yup.string().required(VALIDATION_MESSAGES.required),
  isActive: Yup.boolean().required(VALIDATION_MESSAGES.required),
})

export const resolveDefaultValues = (
  currentProcess?: IProcess,
): IProcessFormValues => ({
  name: currentProcess?.name || '',
  isActive: currentProcess?.isActive || true,
  createdAt: currentProcess?.createdAt || undefined,
  updatedAt: currentProcess?.updatedAt || undefined,
  templateProcesses: undefined,
  userId: currentProcess?.userId || 0,
})
