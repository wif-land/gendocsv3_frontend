import * as Yup from 'yup'

import { IProcess } from '../../domain/entities/IProcess'
import { IProcessTableFilters } from '../components/ProcessTableTooldar'

export const TABLE_HEAD = [
  { id: 'name', label: 'Proceso' },
  { id: 'isActive', label: 'Estado', width: 140 },
  { id: 'actions', label: 'Acciones', width: 110 },
]

export const defaultFilters: IProcessTableFilters = {
  name: '',
}

export const NewProcessSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es requerido'),
  isActive: Yup.boolean().required('El estado es requerido'),
})

export const resolveDefaultValues = (currentProcess?: IProcess) => ({
  name: currentProcess?.name || '',
  isActive: currentProcess?.isActive || true,
})
