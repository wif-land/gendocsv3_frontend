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

const MAX_CREDITS_TO_APPROVE = 140

export const NewStudentSchema = yup.object().shape({
  ...DEFAULT_PERSON_SCHEMA.fields,
  registration: yup.string().required(VALIDATION_MESSAGES.required),
  approvedCredits: yup
    .number()
    .required(VALIDATION_MESSAGES.required)
    .max(MAX_CREDITS_TO_APPROVE, 'Debe ser entre 0 y 140')
    .min(0, 'Debe ser entre 0 y 140'),
  folio: yup.string().required(VALIDATION_MESSAGES.required),
  career: yup.number().required(VALIDATION_MESSAGES.required),
  vinculationHours: yup.number(),
  internshipHours: yup.number(),
  bachelorDegree: yup.string(),
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
  birthdate: currentStudent?.birthdate || '',
  canton: (currentStudent?.canton as ICanton)?.id || null,
  career: (currentStudent?.career as ICareer)?.id || null,
  approvedCredits: currentStudent?.approvedCredits || null,
  startStudiesDate: currentStudent?.startStudiesDate || null,
  bachelorDegree: currentStudent?.bachelorDegree || null,
  vinculationHours: currentStudent?.vinculationHours || null,
  internshipHours: currentStudent?.internshipHours || null,
  endStudiesDate: currentStudent?.endStudiesDate || null,
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
