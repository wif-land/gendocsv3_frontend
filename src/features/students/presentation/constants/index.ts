import * as yup from 'yup'
import { StudentUseCasesImpl } from '../../domain/usecases/StudentServices'
import { enqueueSnackbar } from 'notistack'
import { IStudent } from '../../domain/entities/IStudent'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { VALIDATION_MESSAGES } from '../../../../shared/utils/FormUtil'
import { ICareer } from '../../../careers/domain/entities/ICareer'

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
    label: 'Carrrera',
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
  dni: yup.string().required(VALIDATION_MESSAGES.required),
  firstName: yup.string().required(VALIDATION_MESSAGES.required),
  secondName: yup.string().required(VALIDATION_MESSAGES.required),
  firstLastName: yup.string().required(VALIDATION_MESSAGES.required),
  secondLastName: yup.string().required(VALIDATION_MESSAGES.required),
  personalEmail: yup
    .string()
    .required(VALIDATION_MESSAGES.required)
    .matches(
      /^[A-Z0-9._%+-]+@+[A-Z0-9._%+-]+\.com$/i,
      VALIDATION_MESSAGES.invalidFormat,
    ),
  outlookEmail: yup
    .string()
    .required(VALIDATION_MESSAGES.required)
    .matches(
      /^[A-Z0-9._%+-]+@uta\.edu\.ec$/i,
      VALIDATION_MESSAGES.invalidFormat,
    ),
  phoneNumber: yup
    .string()
    .required(VALIDATION_MESSAGES.required)
    .matches(/^0\d{9}$/, VALIDATION_MESSAGES.invalidFormat),
  registration: yup.string().required(VALIDATION_MESSAGES.required),
  approvedCredits: yup
    .number()
    .required(VALIDATION_MESSAGES.required)
    .max(MAX_CREDITS_TO_APPROVE)
    .min(0),
  folio: yup.string().required(VALIDATION_MESSAGES.required),
  career: yup.number().required(VALIDATION_MESSAGES.required),
})

export const resolveDefaultValues = (
  currentStudent?: IStudent,
): Record<string, unknown> => ({
  dni: currentStudent?.dni || '',
  firstName: currentStudent?.firstName || '',
  secondName: currentStudent?.secondName || '',
  firstLastName: currentStudent?.firstLastName || '',
  secondLastName: currentStudent?.secondLastName || '',
  outlookEmail: currentStudent?.outlookEmail || '',
  personalEmail: currentStudent?.personalEmail || '',
  phoneNumber: currentStudent?.phoneNumber || '',
  regularPhoneNumber: currentStudent?.regularPhoneNumber || '',
  isActive: currentStudent?.isActive || true,
  registration: currentStudent?.registration || '',
  approvedCredits: currentStudent?.approvedCredits || 0,
  folio: currentStudent?.folio || '',
  gender: currentStudent?.gender || '',
  birthdate: currentStudent?.birthdate || '',
  canton: currentStudent?.canton || '',
  career: (currentStudent?.career as ICareer)?.id || 0,
})

export const handleCreate = async (values: FormValuesProps) => {
  const result = await StudentUseCasesImpl.getInstance().create(values)

  if (result.status === HTTP_STATUS_CODES.CREATED) {
    enqueueSnackbar('Estudiante creado con éxito')
    return
  }
  enqueueSnackbar('Error al crear el Estudiante', { variant: 'error' })
}

export const handleUpdate = async (
  id: number,
  values: Partial<IStudent> | null,
) => {
  if (!values) {
    enqueueSnackbar('No se han encontrado valores para actualizar', {
      variant: 'warning',
    })
    return
  }

  const result = await StudentUseCasesImpl.getInstance().update(id, values)

  if (!result) {
    enqueueSnackbar('Error al actualizar el Estudiante', {
      variant: 'error',
    })
    return
  }

  enqueueSnackbar('Estudiante actualizado con éxito')
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

export const CANTONES = [
  {
    value: 'Ambato',
    label: 'Ambato',
  },
  {
    value: 'Banos',
    label: 'Baños',
  },
  {
    value: 'Cevallos',
    label: 'Cevallos',
  },
  {
    value: 'Mocha',
    label: 'Mocha',
  },
  {
    value: 'Patate',
    label: 'Patate',
  },
  {
    value: 'Pillaro',
    label: 'Pillaro',
  },
  {
    value: 'Quero',
    label: 'Quero',
  },
  {
    value: 'Tisaleo',
    label: 'Tisaleo',
  },
  {
    value: 'Ibarra',
    label: 'Ibarra',
  },
]
