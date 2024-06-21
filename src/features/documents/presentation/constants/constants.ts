import { IDocumentTableFilters } from '../components/DocumentTableToolbar'
import * as yup from 'yup'

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

export const STUDENT_DOCUMENTS_TABLE_HEAD = [
  {
    key: 'number',
    label: 'Número',
  },
  {
    key: 'description',
    label: 'Descripción',
  },
]

export const STUDENT_DEGREE_CERTIFICATES_TABLE_HEAD = [
  {
    key: 'number',
    label: 'Número',
  },
  {
    key: 'certificateStatus',
    label: 'Estado',
  },
  {
    key: 'certificateType',
    label: 'Tipo',
  },
  {
    key: 'topic',
    label: 'Tema',
  },
  {
    key: 'presentationDate',
    label: 'Fecha de presentación',
  },
]

export const defaultFilters: IDocumentTableFilters = {
  createdAt: null,
  number: null,
}

export const resolveDefaultValues = () => ({
  number: undefined,
  councilId: undefined,
  templateId: undefined,
  student: null,
  functionariesIds: [],
  userId: undefined,
  description: '',
})

export const NewDocumentSchema = yup.object({
  // name: yup.string().required('El nombre es requerido'),
})
