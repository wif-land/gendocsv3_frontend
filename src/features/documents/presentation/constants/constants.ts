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
  number: currentDocument?.number,
  councilId: currentDocument?.councilId,
  templateId: currentDocument?.templateId,
  studentId: currentDocument?.studentId,
  functionariesIds: currentDocument?.functionariesIds || [],
  userId: currentDocument?.userId,
  description: currentDocument?.description || '',
})

export const NewDocumentSchema = yup.object({
  // name: yup.string().required('El nombre es requerido'),
})
