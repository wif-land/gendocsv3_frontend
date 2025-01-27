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
    key: 'studentName',
    label: 'Estudiante',
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
  field: '',
  startDate: DateUtils.FIRST_DAY_OF_YEAR,
  endDate: DateUtils.getToday(),
  order: 'DESC',
})

export const resolveDefaultValues = () => ({
  number: null as unknown as number,
  councilId: null as unknown as { id: number; label: string },
  processId: null as unknown as { id: number; label: string },
  templateId: null as unknown as number,
  student: null as unknown as { id: number; label: string },
  functionariesIds: [] as unknown as { id: number; label: string }[],
  userId: null as unknown as number,
  description: '',
})

export const NewDocumentSchema = yup.object({
  number: yup.number().required('El número es requerido'),
  councilId: yup
    .object({
      id: yup.number(),
      label: yup.string(),
    })
    .required('El consejo es requerido'),
  processId: yup
    .object({
      id: yup.number(),
      label: yup.string(),
    })
    .required('El proceso es requerido'),
  templateId: yup.number().required('La plantilla es requerida'),
  student: yup
    .object({
      id: yup.number(),
      label: yup.string(),
    })
    .notRequired(),
  functionariesIds: yup.array().of(
    yup.object({
      id: yup.number(),
      label: yup.string(),
    }),
  ),
  userId: yup.number().nullable(),
  description: yup.string(),
})
