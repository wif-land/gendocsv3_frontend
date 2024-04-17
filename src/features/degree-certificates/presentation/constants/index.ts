/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup'
import { ICouncilTableFilters } from '../../../council/presentation/components/CouncilTableToolbar'
import { IDegreeCertificate } from '../../domain/entities/IDegreeCertificates'
import { IStudent } from '@/features/students/domain/entities/IStudent'
export interface FormValuesProps extends IDegreeCertificate {}
export const TABLE_HEAD = [
  { id: 'name', label: 'Acta de Grado' },
  { id: 'createdAt', label: 'Hora de ejecución', width: 160 },
  { id: 'date', label: 'Fecha de ejecución', width: 260 },
  { id: 'isActive', label: 'Estado', width: 140 },
  { id: 'actions', label: 'Acciones', width: 110 },
]

export const resolveDefaultValues = (
  currentDegreeCertificate?: IDegreeCertificate,
) => ({
  number: currentDegreeCertificate?.number || 0,
  aux_number: currentDegreeCertificate?.aux_number || 0,
  topic: currentDegreeCertificate?.topic || '',
  presentationDate: currentDegreeCertificate?.presentationDate || new Date(),
  studentId: currentDegreeCertificate?.studentId
    ? getSelectedStudent(currentDegreeCertificate?.studentId as IStudent)
    : '',
  careerId: currentDegreeCertificate?.careerId || 0,
  certificateTypeId: currentDegreeCertificate?.certificateTypeId || 0,
  certificateStatusId: currentDegreeCertificate?.certificateStatusId || 0,
  degreeModalityId: currentDegreeCertificate?.degreeModalityId || 0,
  roomId: currentDegreeCertificate?.roomId || 0,
  duration: currentDegreeCertificate?.duration || 0,
  link: currentDegreeCertificate?.link || '',
  gradesSheetDriveId: currentDegreeCertificate?.gradesSheetDriveId || '',
  documentDriveId: currentDegreeCertificate?.documentDriveId || '',
  isClosed: currentDegreeCertificate?.isClosed || false,
})

export const getSelectedStudent = (currentStudent?: IStudent) =>
  `${currentStudent?.firstName} ${currentStudent?.secondName} ${currentStudent?.firstLastName} ${currentStudent?.secondLastName} - ${currentStudent?.dni}`

export const defaultFilters: ICouncilTableFilters = {
  name: '',
}

export const NewDegreeCertificateSchema = Yup.object().shape({
  isActive: Yup.boolean().required('El estado es requerido'),
})
