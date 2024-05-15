import { IDegCerTemplatesFilters } from '../../domain/entities/IDegCerFilters'

/* eslint-disable @typescript-eslint/no-explicit-any */
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
