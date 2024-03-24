import { IDocumentTableFilters } from '../components/DocumentTableToolbar'

export const TABLE_HEAD = [
  {
    key: 'number',
    label: 'Número',
  },
  {
    key: 'description',
    label: 'Descripción',
  },
  {
    key: 'actions',
    label: 'Acciones',
  },
]

export const defaultFilters: IDocumentTableFilters = {
  createdAt: null,
  number: 0,
}
