/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup'
import { IDegreeCertificate } from '../../domain/entities/IDegreeCertificates'
import { IStudent } from '../../../students/domain/entities/IStudent'
import {
  ICertificateStatus,
  ICertificateType,
  IDegreeModality,
  IRoom,
} from '../../../../core/providers/domain/entities/ICertificateProvider'
import {
  DEGREE_ATTENDANCE_ROLES,
  IDegreeCertificatesAttendee,
} from '../../domain/entities/IDegreeCertificateAttendee'
import { enqueueSnackbar } from 'notistack'
import { DegreeCertificateForBulk } from '../components/DegreeBulkUploadDialog'
import { IDegreeCertificateTableFilters } from '../components/DegreeTableToolbar'
import { IFunctionaryFormValues } from '../../../functionaries/domain/entities/IFunctionary'
import { ReadonlyURLSearchParams } from 'next/navigation'

export interface FormValuesProps
  extends Omit<
    IDegreeCertificate,
    'certificateType' | 'certificateStatus' | 'degreeModality' | 'room'
  > {
  selectedValue: { id: number; label: string }
  certificateTypeId: number
  certificateStatusId: number
  degreeModalityId: number
  roomId?: number
}

export interface AttendanceFormValuesProps
  extends Omit<
    IDegreeCertificatesAttendee,
    'hasAttended' | 'hasBeenNotified'
  > {}

export const getTableHead = (isReport: boolean) => {
  const baseHeaders = [
    { id: 'auxNumber', label: '#Reg' },
    { id: 'number', label: 'Número Acta' },
    { id: 'topic', label: 'Tema' },
    { id: 'student', label: 'Estudiante' },
    { id: 'presentationDate', label: 'Fecha de presentación' },
    { id: 'room', label: 'Aula', width: 140 },
    { id: 'certificateStatus', label: 'Estado', width: 110 },
  ]

  if (isReport === false) {
    baseHeaders.push({ id: 'actions', label: 'Acciones', width: 110 })
  }

  return baseHeaders
}

export const TABLE_ASSISTANCE_HEAD = [
  { id: 'topic', label: 'Tema' },
  { id: 'student', label: 'Estudiante' },
  { id: 'presentationDate', label: 'Fecha de presentación' },
  { id: 'degreeModality', label: 'Modalidad', width: 140 },
  { id: 'room', label: 'Aula', width: 140 },
  { id: 'certificateStatus', label: 'Estado', width: 110 },
  { id: 'actions', label: 'Acciones', width: 110 },
]

export const resolveDefaultValuesDegreeCertificate = (
  currentDegreeCertificate?: IDegreeCertificate,
): FormValuesProps => ({
  number: currentDegreeCertificate?.number || (null as any),
  auxNumber: currentDegreeCertificate?.auxNumber || (null as any),
  topic: currentDegreeCertificate?.topic || '',
  presentationDate: currentDegreeCertificate?.presentationDate || undefined,
  student: getSelectedStudent(currentDegreeCertificate?.student as IStudent),
  career: currentDegreeCertificate?.career || (undefined as any),
  certificateTypeId:
    (currentDegreeCertificate?.certificateType as ICertificateType)?.id ||
    (undefined as any),
  certificateStatusId:
    (currentDegreeCertificate?.certificateStatus as ICertificateStatus)?.id ||
    1,
  degreeModalityId:
    (currentDegreeCertificate?.degreeModality as IDegreeModality)?.id ||
    (undefined as any),
  roomId: (currentDegreeCertificate?.room as IRoom)?.id || (undefined as any),
  duration: currentDegreeCertificate?.duration || 60,
  link: currentDegreeCertificate?.link || '',
  gradesSheetDriveId: currentDegreeCertificate?.gradesSheetDriveId || '',
  certificateDriveId: currentDegreeCertificate?.certificateDriveId || '',
  isClosed: currentDegreeCertificate?.isClosed || false,
  selectedValue: {
    id: currentDegreeCertificate?.student?.id || 0,
    label:
      getSelectedStudent(currentDegreeCertificate?.student as IStudent).label ||
      '',
  } as any,
  user: currentDegreeCertificate?.user || ({} as any),
  changeUniversityResolution:
    currentDegreeCertificate?.changeUniversityResolution,
  changeUniversityDate: currentDegreeCertificate?.changeUniversityDate,
  changeUniversityName: currentDegreeCertificate?.changeUniversityName,
})

export const resolveDefaultValuesDegreeCertificateAttendee = (
  currentAttendee?: IDegreeCertificatesAttendee,
): AttendanceFormValuesProps => ({
  assignationDate: currentAttendee?.assignationDate || new Date(),
  details: currentAttendee?.details || '',
  functionary: currentAttendee?.functionary
    ? ({
        id: currentAttendee?.functionary.id,
        label: `${currentAttendee?.functionary.firstName} ${currentAttendee?.functionary.firstLastName} - ${currentAttendee?.functionary.dni}`,
      } as any as IFunctionaryFormValues)
    : ({
        id: 0,
        label: '',
      } as any as IFunctionaryFormValues),
  role: currentAttendee?.role || DEGREE_ATTENDANCE_ROLES.PRINCIPAL,
  id: currentAttendee?.id || undefined,
  createdAt: currentAttendee?.createdAt || undefined,
})

export const getSelectedStudent = (currentStudent?: IStudent): IStudent =>
  currentStudent
    ? {
        ...currentStudent,
        id: currentStudent.id || 0,
        label:
          `${currentStudent.firstName} ${currentStudent.secondName || ''} ${
            currentStudent.firstLastName
          } ${currentStudent.secondLastName || ''} - ${currentStudent.dni}` ||
          '',
      }
    : ({
        id: 0,
        label: '',
      } as IStudent)

export const defaultFilters = (
  searchParams: ReadonlyURLSearchParams,
  defaultCareerId: number,
): IDegreeCertificateTableFilters => ({
  field: searchParams.has('field')
    ? (searchParams.get('field') as string)
    : undefined,
  careerId: searchParams.has('careerId')
    ? +parseInt(searchParams.get('careerId') as string)
    : defaultCareerId,
  isEnd: searchParams.has('isEnd')
    ? searchParams.get('isEnd') === 'true'
    : false,
  isReport:
    // searchParams.has('isReport')
    // ? // eslint-disable-next-line eqeqeq
    //   Boolean(searchParams.get('isReport') == 'true')
    false,
  startDate: searchParams.has('startDate')
    ? new Date(searchParams.get('startDate') as string)
    : new Date(),
  endDate: searchParams.has('endDate')
    ? new Date(searchParams.get('endDate') as string)
    : new Date(),
})

export const NewDegreeCertificateSchema = Yup.object().shape({
  topic: Yup.string()
    .required('El tema es requerido')
    .min(5, 'Entre 5 y 255 carácteres')
    .max(255, 'Entre 5 y 255 carácteres'),
  // selectedValue: Yup.object().shape({
  //   id: Yup.number().min(1).required('El estudiante es requerido'),
  //   label: Yup.string().required('El estudiante es requerido'),
  // }),
  // career: Yup.number().required('La carrera es requerida'),
  certificateTypeId: Yup.mixed().required('El tipo de acta es requerido'),
  // certificateStatus: Yup.mixed().required('El estado de acta es requerido'),
  degreeModalityId: Yup.mixed().required('La modalidad es requerida'),
  // room: Yup.mixed().required('El aula es requerida'),
  // duration: Yup.number().required('La duración es requerida'),
})

export const NewDegreeCertificateAttendanceSchema = Yup.object().shape({
  role: Yup.string().required('El rol es requerido'),
  details: Yup.string().when('role', (role, schema) => {
    if ((role[0] as unknown as string) === DEGREE_ATTENDANCE_ROLES.MENTOR) {
      return schema.notRequired()
    }
    return schema.required('El documento de asignación es requerido')
  }),
  assignationDate: Yup.date().required('La fecha de asignación es requerida'),
})

/* eslint-disable @typescript-eslint/no-explicit-any */
export const transformData = (data: any[]): DegreeCertificateForBulk[] =>
  data.reduce((acc: DegreeCertificateForBulk[], item: any) => {
    const isEmpty = Object.values(item).every((x) => x === null || x === '')
    if (isEmpty) return acc

    if (!item['Cédula']) {
      enqueueSnackbar(
        'Por favor, asegúrate de que todos los campos estén completos',
        { variant: 'warning' },
      )
      return acc
    }

    const safeToString = (value: any) => {
      if (value === null || value === undefined) return ''
      return value.toString()
    }

    const changeUniversityDate = item['Inicio clases anterior universidad']
      ? new Date(
          item['Inicio clases anterior universidad']
            .split('/')
            .reverse()
            .join('-'),
        )
      : undefined

    acc.push({
      topic: safeToString(item['Tema']),
      studentDni: safeToString(item['Cédula']),
      certificateType: safeToString(item['Modalidad Titulación']),
      certificateStatus: item['Estado Acta']
        ? String(item['Estado Acta']).trim().toUpperCase()
        : undefined,
      firstMainQualifierDni: safeToString(item['Ced Calif Prino 1']),
      secondMainQualifierDni: safeToString(item['Ced Calif Prino 2']),
      firstSecondaryQualifierDni: safeToString(item['Ced Calf Supl 1']),
      secondSecondaryQualifierDni: safeToString(item['Ced Calf Supl 2']),
      mentorDni: safeToString(item['Ced Tutor']),
      qualifiersResolution: safeToString(item['Resolución calificadores']),
      curriculumGrade: safeToString(item['Nota Malla']),
      gradesDetails: safeToString(item['Detalle Notas']),
      changeUniversityDate,
      changeUniversityName: item['Universidad estudios previos']
        ? safeToString(item['Universidad estudios previos'])
        : undefined,
      changeUniversityResolution: item['Nro. Resolución Cambio de Universidad']
        ? safeToString(item['Nro. Resolución Cambio de Universidad'])
        : undefined,
    } as DegreeCertificateForBulk)
    return acc
  }, [])
