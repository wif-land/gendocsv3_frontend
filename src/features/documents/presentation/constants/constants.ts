import { DateUtils } from '@/shared/utils/dateUtils'
import { IDocumentFilters } from '../components/DocumentTableToolbar'
import * as yup from 'yup'

export const TABLE_HEAD = [
  {
    key: 'number',
    label: 'Número',
  },
  {
    key: 'createdAt',
    label: 'Fecha de creación',
  },
  {
    key: 'userName',
    label: 'Creado Por',
  },
  {
    key: 'councilId',
    label: 'Consejo',
  },
  {
    key: 'templateId',
    label: 'Plantilla',
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

export const defaultFilters = (moduleId: number): IDocumentFilters => ({
  moduleId,
  field: undefined,
  startDate: DateUtils.FIRST_DAY_OF_YEAR,
  endDate: DateUtils.getToday(),
  order: 'DESC',
})

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
