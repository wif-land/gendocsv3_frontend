import { ChipComponentProps } from '../../../../../shared/components/ChipComponent'

export const COLUMNS = [
  {
    key: 'name',
    label: 'Nombre',
  },
  {
    key: 'date',
    label: 'Fecha de ejecución',
  },
  {
    key: 'type',
    label: 'Tipo',
  },
  {
    key: 'isActive',
    label: 'Estado',
  },
  {
    key: 'actions',
    label: 'Acciones',
  },
]

export const resolveChipData = (
  isActive: boolean,
  isArchived: boolean,
): ChipComponentProps => {
  if (isArchived) {
    return {
      color: 'secondary',
      label: 'Archivado',
    }
  }

  if (isActive) {
    return {
      color: 'primary',
      label: 'Activado',
    }
  }

  return {
    color: 'primary',
    label: 'Pausado',
  }
}
