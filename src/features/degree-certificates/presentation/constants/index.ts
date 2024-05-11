/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup'
import { IDegreeCertificate } from '../../domain/entities/IDegreeCertificates'
import { IStudent } from '../../../students/domain/entities/IStudent'
import { IDegreeCertificateFilters } from '../../domain/entities/IDegreeCertificateFilters'

export interface FormValuesProps extends IDegreeCertificate {
  selectedValue: { id: number; label: string }
}

export const TABLE_HEAD = [
  { id: 'topic', label: 'Tema' },
  { id: 'student', label: 'Estudiante' },
  { id: 'presentationDate', label: 'Fecha de presentación' },
  { id: 'degreeModality', label: 'Modalidad', width: 140 },
  { id: 'room', label: 'Aula', width: 140 },
  { id: 'certificateStatus', label: 'Estado de acta', width: 110 },
  { id: 'actions', label: 'Acciones', width: 110 },
]

export const resolveDefaultValues = (
  currentDegreeCertificate?: IDegreeCertificate,
): FormValuesProps => ({
  number: currentDegreeCertificate?.number || (null as any),
  aux_number: currentDegreeCertificate?.aux_number || (null as any),
  topic: currentDegreeCertificate?.topic || '',
  presentationDate: currentDegreeCertificate?.presentationDate || new Date(),
  student: getSelectedStudent(currentDegreeCertificate?.student as IStudent),
  career: currentDegreeCertificate?.career || 0,
  certificateType: currentDegreeCertificate?.certificateType || 0,
  certificateStatus: currentDegreeCertificate?.certificateStatus || 0,
  degreeModality: currentDegreeCertificate?.degreeModality || ({} as any),
  room: currentDegreeCertificate?.room || 0,
  duration: currentDegreeCertificate?.duration || (null as any),
  link: currentDegreeCertificate?.link || '',
  gradesSheetDriveId: currentDegreeCertificate?.gradesSheetDriveId || '',
  documentDriveId: currentDegreeCertificate?.documentDriveId || '',
  isClosed: currentDegreeCertificate?.isClosed || false,
  selectedValue: {
    id: currentDegreeCertificate?.student?.id || 0,
    label: currentDegreeCertificate?.student?.label || '',
  } as any,
})

export const getSelectedStudent = (currentStudent?: IStudent): IStudent =>
  currentStudent
    ? {
        ...currentStudent,
        id: currentStudent.id || 0,
        label:
          `${currentStudent.firstName} ${currentStudent.firstLastName}` || '',
      }
    : ({
        id: 0,
        label: '',
      } as IStudent)

export const defaultFilters: IDegreeCertificateFilters = {
  name: '',
}

export const NewDegreeCertificateSchema = Yup.object().shape({
  // topic: Yup.string().required('El tema es requerido'),
  // student: Yup.object().shape({
  //   id: Yup.number().min(1).required('El estudiante es requerido'),
  //   label: Yup.string().required('El estudiante es requerido'),
  // }),
  // career: Yup.number().required('La carrera es requerida'),
  // certificateType: Yup.number().required('El tipo de acta es requerido'),
  // certificateStatus: Yup.number().required('El estado de acta es requerido'),
  // degreeModality: Yup.number().required('La modalidad es requerida'),
  // room: Yup.number().required('El aula es requerida'),
  // duration: Yup.number().required('La duración es requerida'),
  // link: Yup.string().required('El enlace es requerido'),
  // gradesSheetDriveId: Yup.string().required(
  //   'El id de la hoja de calificaciones es requerido',
  // ),
  // documentDriveId: Yup.string().required('El id del documento es requerido'),
})
