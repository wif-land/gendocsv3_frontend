/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup'
import { IDegreeCertificate } from '../../domain/entities/IDegreeCertificates'
import { IStudent } from '../../../students/domain/entities/IStudent'
import { IDegreeCertificateFilters } from '../../domain/entities/IDegreeCertificateFilters'
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

export interface AttendanceFormValuesProps {
  members: {
    tutor: IDegreeCertificatesAttendee
    president: IDegreeCertificatesAttendee
    firstMember: IDegreeCertificatesAttendee
    secondMember: IDegreeCertificatesAttendee
    firstSubstitute: IDegreeCertificatesAttendee
    secondSubstitute: IDegreeCertificatesAttendee
  }
}

export const RoleLabels = {
  tutor: 'Tutor',
  president: 'Presidente',
  firstMember: 'Primer miembro',
  secondMember: 'Segundo miembro',
  firstSubstitute: 'Primer suplente',
  secondSubstitute: 'Segundo suplente',
}

export const TABLE_HEAD = [
  { id: 'topic', label: 'Tema' },
  { id: 'student', label: 'Estudiante' },
  { id: 'presentationDate', label: 'Fecha de presentación' },
  { id: 'degreeModality', label: 'Modalidad', width: 140 },
  { id: 'room', label: 'Aula', width: 140 },
  { id: 'certificateStatus', label: 'Estado', width: 110 },
  { id: 'actions', label: 'Acciones', width: 110 },
]

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
  roomId: (currentDegreeCertificate?.room as IRoom)?.id || undefined,
  duration: currentDegreeCertificate?.duration || (null as any),
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
})

export const resolveDefaultValuesDegreeCertificateAssistance = (
  currentDegreeCertificate?: IDegreeCertificate,
): AttendanceFormValuesProps => ({
  members: {
    tutor: currentDegreeCertificate?.members?.find(
      (member) => member.role === DEGREE_ATTENDANCE_ROLES.MENTOR,
    ) as any,
    president: currentDegreeCertificate?.members?.find(
      (member) => member.role === DEGREE_ATTENDANCE_ROLES.PRESIDENT,
    ) as any,
    firstMember: currentDegreeCertificate?.members?.find(
      (member) => member.role === DEGREE_ATTENDANCE_ROLES.PRINCIPAL,
    ) as any,
    secondMember: currentDegreeCertificate?.members?.find(
      (member) => member.role === DEGREE_ATTENDANCE_ROLES.PRINCIPAL,
    ) as any,
    firstSubstitute: currentDegreeCertificate?.members?.find(
      (member) => member.role === DEGREE_ATTENDANCE_ROLES.SUBSTITUTE,
    ) as any,
    secondSubstitute: currentDegreeCertificate?.members?.find(
      (member) => member.role === DEGREE_ATTENDANCE_ROLES.SUBSTITUTE,
    ) as any,
  },
})

export const getSelectedStudent = (currentStudent?: IStudent): IStudent =>
  currentStudent
    ? {
        ...currentStudent,
        id: currentStudent.id || 0,
        label:
          `${currentStudent.firstName} ${currentStudent.secondName} ${currentStudent.firstLastName} ${currentStudent.secondLastName} - ${currentStudent.dni}` ||
          '',
      }
    : ({
        id: 0,
        label: '',
      } as IStudent)

export const defaultFilters: IDegreeCertificateFilters = {
  name: '',
  career: 1,
}

export const NewDegreeCertificateSchema = Yup.object().shape({
  topic: Yup.string().required('El tema es requerido'),
  // selectedValue: Yup.object().shape({
  //   id: Yup.number().min(1).required('El estudiante es requerido'),
  //   label: Yup.string().required('El estudiante es requerido'),
  // }),
  // career: Yup.number().required('La carrera es requerida'),
  // certificateType: Yup.mixed().required('El tipo de acta es requerido'),
  // certificateStatus: Yup.mixed().required('El estado de acta es requerido'),
  // degreeModality: Yup.mixed().required('La modalidad es requerida'),
  // room: Yup.mixed().required('El aula es requerida'),
  // duration: Yup.number().required('La duración es requerida'),
})

export const NewDegreeCertificateAttendanceSchema = Yup.object().shape({
  members: Yup.object().shape({
    tutor: Yup.object().shape({}).required('El tutor es requerido'),
    president: Yup.object().shape({}).required('El presidente es requerido'),
    firstMember: Yup.object()
      .shape({})
      .required('El primer miembro es requerido'),
    secondMember: Yup.object()
      .shape({})
      .required('El segundo miembro es requerido'),
    firstSubstitute: Yup.object().shape({}),
    secondSubstitute: Yup.object().shape({}),
  }),
})
