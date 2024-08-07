import * as yup from 'yup'
import { StudentUseCasesImpl } from '../../domain/usecases/StudentServices'
import { enqueueSnackbar } from 'notistack'
import { IStudent } from '../../domain/entities/IStudent'
import {
  DEFAULT_PERSON_SCHEMA,
  VALIDATION_MESSAGES,
  resolveDefaultSchema,
} from '../../../../shared/utils/FormUtil'
import { ICareer } from '../../../careers/domain/entities/ICareer'
import { ICanton } from '../../../../core/providers/domain/entities/ILocationProvider'
import { StudentModel } from '../../data/models/StudentModel'

export interface FormValuesProps extends IStudent {}

export const TABLE_HEAD = [
  {
    id: 'name',
    label: 'Estudiante',
  },
  {
    id: 'outlookEmail',
    label: 'Email',
  },
  {
    id: 'career',
    label: 'Carrera',
  },
  {
    id: 'isActive',
    label: 'Estado',
  },
  {
    id: 'actions',
    label: 'Acciones',
  },
]

const MAX_CREDITS_TO_APPROVE = 247

export const NewStudentSchema = yup.object().shape({
  ...DEFAULT_PERSON_SCHEMA.fields,
  approvedCredits: yup
    .number()
    .positive()
    .max(MAX_CREDITS_TO_APPROVE, 'Debe ser entre 0 y 247')
    .min(0, 'Debe ser entre 0 y 247'),
  career: yup.number().required(VALIDATION_MESSAGES.required),
  vinculationHours: yup
    .number()
    .positive()
    .test({
      name: 'max',
      message: 'Debe ser entre 0 y 600',
      test: (value = 0) => value === null || (value >= 0 && value <= 600),
    })
    .nullable(),
  internshipHours: yup
    .number()
    .positive()
    .min(0, 'Debe ser entre 0 y 500')
    .max(500, 'Debe ser entre 0 y 500')
    .nullable(),
  bachelorDegree: yup.string().nullable(),
})

export const resolveDefaultValues = (
  currentStudent?: IStudent,
): Record<string, unknown> => ({
  ...resolveDefaultSchema(currentStudent),
  regularPhoneNumber: currentStudent?.regularPhoneNumber || '',
  isActive: currentStudent?.isActive || true,
  registration: currentStudent?.registration || '',
  folio: currentStudent?.folio || '',
  gender: currentStudent?.gender || '',
  birthdate: currentStudent?.birthdate || null,
  canton: (currentStudent?.canton as ICanton)?.id || null,
  career: (currentStudent?.career as ICareer)?.id || null,
  approvedCredits: currentStudent?.approvedCredits || null,
  startStudiesDate: currentStudent?.startStudiesDate || null,
  bachelorDegree: currentStudent?.bachelorDegree || null,
  vinculationHours: currentStudent?.vinculationHours || null,
  internshipHours: currentStudent?.internshipHours || null,
  endStudiesDate: currentStudent?.endStudiesDate || null,
  highSchoolName: currentStudent?.highSchoolName || '',
})

export const handleCreate = async (values: FormValuesProps) => {
  await StudentUseCasesImpl.getInstance().create(values)
}

export const handleUpdate = async (
  id: number,
  values: Partial<IStudent> | null,
) => {
  if (!values) {
    enqueueSnackbar('No se han encontrado valores para actualizar', {
      variant: 'warning',
    })
    return StudentModel.fromJson({})
  }

  return await StudentUseCasesImpl.getInstance().update(id, values)
}

export const GENDERS = [
  {
    value: 'M',
    label: 'Masculino',
  },
  {
    value: 'F',
    label: 'Femenino',
  },
]

export type FileFormat =
  | 'studentsByCareer'
  | 'vinculationAndPractices'
  | 'qualifiers'

export const FILE_FORMATS_TO_UPLOAD = [
  {
    value: 'studentsByCareer',
    label: 'Estudiantes por carrera',
  },
  {
    value: 'vinculationAndPractices',
    label: 'Vinculación y prácticas',
  },
  {
    value: 'qualifiers',
    label: 'Calificadores',
  },
]
