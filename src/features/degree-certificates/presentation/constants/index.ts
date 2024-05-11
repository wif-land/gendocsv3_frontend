/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup'
import { IDegreeCertificate } from '../../domain/entities/IDegreeCertificates'
import { IStudent } from '../../../students/domain/entities/IStudent'
import { IDegreeCertificateFilters } from '../../domain/entities/IDegreeCertificateFilters'
import { StudentModel } from '../../../students/data/models/StudentModel'

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
  number: currentDegreeCertificate?.number || 0,
  aux_number: currentDegreeCertificate?.aux_number || 0,
  topic: currentDegreeCertificate?.topic || '',
  presentationDate: currentDegreeCertificate?.presentationDate || new Date(),
  student: getSelectedStudent(currentDegreeCertificate?.student as IStudent),
  career: currentDegreeCertificate?.career || 0,
  certificateType: currentDegreeCertificate?.certificateType || 0,
  certificateStatus: currentDegreeCertificate?.certificateStatus || 0,
  degreeModality: currentDegreeCertificate?.degreeModality || ({} as any),
  room: currentDegreeCertificate?.room || 0,
  duration: currentDegreeCertificate?.duration || 0,
  link: currentDegreeCertificate?.link || '',
  gradesSheetDriveId: currentDegreeCertificate?.gradesSheetDriveId || '',
  documentDriveId: currentDegreeCertificate?.documentDriveId || '',
  isClosed: currentDegreeCertificate?.isClosed || false,
  selectedValue: {
    id: currentDegreeCertificate?.student?.id || 0,
    label: `${currentDegreeCertificate?.student?.firstName} ${currentDegreeCertificate?.student?.firstLastName}`,
  },
})

export const getSelectedStudent = (currentStudent?: IStudent): IStudent =>
  currentStudent
    ? {
        ...currentStudent,
        id: currentStudent.id || 0,
        label: `${currentStudent.firstName} ${currentStudent.firstLastName}`,
      }
    : StudentModel.fromJson({})

export const defaultFilters: IDegreeCertificateFilters = {
  name: '',
}

export const NewDegreeCertificateSchema = Yup.object().shape({
  isActive: Yup.boolean().required('El estado es requerido'),
})
