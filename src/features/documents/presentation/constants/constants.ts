import { DocumentModel } from '../../data/models/DocumentsModel'
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

export const defaultFilters: IDocumentTableFilters = {
  createdAt: null,
  number: null,
}

export const resolveDefaultValues = (currentDocument?: DocumentModel) => ({
  number: currentDocument?.number || 0,
  councilId: currentDocument?.councilId || 0,
  templateId: currentDocument?.templateId || 0,
  studentId: currentDocument?.studentId || 0,
  functionariesIds: currentDocument?.functionariesIds || [],
  userId: currentDocument?.userId || 0,
  description: currentDocument?.description || '',
})

export const NewDocumentSchema = yup.object({
  // name: yup.string().required('El nombre es requerido'),
})
