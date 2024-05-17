import { IDegCerTemplatesFilters } from '../../domain/entities/IDegCerFilters'
import * as Yup from 'yup'

export const TABLE_HEAD = [
  { id: 'code', label: 'Código' },
  { id: 'name', label: 'Nombre' },
  { id: 'certificateTypeCareers', label: 'Carreras' },
  { id: 'certificateTypeStatuses', label: 'Plantillas' },
  { id: 'grades', label: 'Calificaciones' },
]

export const defaultFilters: IDegCerTemplatesFilters = {
  name: '',
}

export const GRADES_TABLE_HEAD = [
  { id: 'variable', label: 'Variable', width: 30 },
  { id: 'text_variable', label: 'Variable texto nota', width: 30 },
  { id: 'celda', label: 'Celda', width: 10 },
  { id: 'delete', label: 'Eliminar', width: 10 },
]

export const NewDefaultGradeSchema = Yup.object().shape({
  gradeVariable: Yup.string().required('La variable es requerida'),
  cell: Yup.string().required('La celda es requerida'),
})

export const resolveDefaultValues = () => ({
  gradeVariable: '',
  cell: '',
})
