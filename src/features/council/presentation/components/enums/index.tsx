import { ChipProps } from '@nextui-org/react'

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
): {
  color: ChipProps['color']
  label: string
} => {
  if (isArchived) {
    return {
      color: 'danger',
      label: 'Archivado',
    }
  }

  if (isActive) {
    return {
      color: 'success',
      label: 'Activado',
    }
  }

  return {
    color: 'warning',
    label: 'Pausado',
  }
}
