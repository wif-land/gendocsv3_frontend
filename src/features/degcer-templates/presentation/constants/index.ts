/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup'
import { IDegreeCertificate } from '../../domain/entities/IDegreeCertificates'
import { IStudent } from '../../../students/domain/entities/IStudent'
import { IDegreeCertificateFilters } from '../../domain/entities/IDegreeCertificateFilters'
export interface FormValuesProps extends IDegreeCertificate {}
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
) => ({
  number: currentDegreeCertificate?.number || 0,
  aux_number: currentDegreeCertificate?.aux_number || 0,
  topic: currentDegreeCertificate?.topic || '',
  presentationDate: currentDegreeCertificate?.presentationDate || new Date(),
  studentId: currentDegreeCertificate?.student
    ? getSelectedStudent(currentDegreeCertificate?.student as IStudent)
    : '',
  careerId: currentDegreeCertificate?.career || 0,
  certificateTypeId: currentDegreeCertificate?.certificateType || 0,
  certificateStatusId: currentDegreeCertificate?.certificateStatus || 0,
  degreeModalityId: currentDegreeCertificate?.degreeModality || 0,
  roomId: currentDegreeCertificate?.room || 0,
  duration: currentDegreeCertificate?.duration || 0,
  link: currentDegreeCertificate?.link || '',
  gradesSheetDriveId: currentDegreeCertificate?.gradesSheetDriveId || '',
  documentDriveId: currentDegreeCertificate?.documentDriveId || '',
  isClosed: currentDegreeCertificate?.isClosed || false,
})

export const getSelectedStudent = (currentStudent?: IStudent) =>
  `${currentStudent?.firstName} ${currentStudent?.secondName} ${currentStudent?.firstLastName} ${currentStudent?.secondLastName} - ${currentStudent?.dni}`

export const defaultFilters: IDegreeCertificateFilters = {
  name: '',
}

export const NewDegreeCertificateSchema = Yup.object().shape({
  isActive: Yup.boolean().required('El estado es requerido'),
})
