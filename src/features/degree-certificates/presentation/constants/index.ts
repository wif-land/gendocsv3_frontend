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

export const NewDegreeCertificateSchema = Yup.object().shape({
  isActive: Yup.boolean().required('El estado es requerido'),
})

export const resolveDefaultValues = (data?: any) => ({
  isActive: data?.isActive || true,
})
