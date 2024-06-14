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

export const TABLE_HEAD = [
  { id: 'topic', label: 'Tema' },
  { id: 'student', label: 'Estudiante' },
  { id: 'presentationDate', label: 'Fecha de presentación' },
  { id: 'degreeModality', label: 'Modalidad', width: 140 },
  { id: 'room', label: 'Aula', width: 140 },
  { id: 'certificateStatus', label: 'Estado', width: 110 },
  { id: 'actions', label: 'Acciones', width: 110 },
]

export const resolveDefaultValues = (
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
