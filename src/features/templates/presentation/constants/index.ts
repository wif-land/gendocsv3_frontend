import * as Yup from 'yup'

import { ITemplate } from '../../domain/entities/ITemplate'
import { ITemplateTableFilters } from '../components/TemplateTableTooldar'

export const TABLE_HEAD = [
  { id: 'name', label: 'Plantilla' },
  { id: 'userId', label: 'Creado Por', width: 140 },
  { id: 'isActive', label: 'Estado', width: 140 },
  { id: 'actions', label: 'Acciones', width: 110 },
]

export const defaultFilters: ITemplateTableFilters = {
  field: undefined,
  state: undefined,
}

export const NewTemplateSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es requerido'),
  isActive: Yup.boolean().required('El estado es requerido'),
})

export const resolveDefaultValues = (currentTemplate?: ITemplate) => ({
  name: currentTemplate?.name || '',
  isActive: currentTemplate?.isActive || true,
})
