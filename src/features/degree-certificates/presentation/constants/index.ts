/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup'
import { ICouncilTableFilters } from '../../../council/presentation/components/CouncilTableToolbar'

export const TABLE_HEAD = [
  { id: 'name', label: 'Acta de Grado' },
  { id: 'createdAt', label: 'Hora de ejecución', width: 160 },
  { id: 'date', label: 'Fecha de ejecución', width: 260 },
  { id: 'isActive', label: 'Estado', width: 140 },
  { id: 'actions', label: 'Acciones', width: 110 },
]

export const defaultFilters: ICouncilTableFilters = {
  name: '',
}

export const NewCouncilSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es requerido'),
  date: Yup.date().required('La fecha es requerida'),
  type: Yup.string().required('El tipo es requerido'),
  isActive: Yup.boolean().required('El estado es requerido'),
  isArchived: Yup.boolean().required('El estado es requerido'),
  president: Yup.string().required('El presidente es requerido'),
  attendees: Yup.array()
    .of(Yup.string())
    .required('Los asistentes son requeridos'),
})

export const resolveDefaultValues = (currentDegreeCertificate?: any) => ({
  name: currentDegreeCertificate?.name || '',
  date: currentDegreeCertificate?.date || new Date(Date.now()),
  type: currentDegreeCertificate?.type,
  isActive: currentDegreeCertificate?.isActive || true,
  isArchived: currentDegreeCertificate?.isArchived || false,
})
