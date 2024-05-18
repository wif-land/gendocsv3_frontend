/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup'
import { CouncilType, ICouncil } from '../../domain/entities/ICouncil'
import { ICouncilTableFilters } from '../components/CouncilTableToolbar'
import { ICouncilAttendee } from '../../domain/entities/ICouncilAttendee'

export const TABLE_HEAD = [
  { id: 'name', label: 'Consejo' },
  { id: 'createdAt', label: 'Hora de ejecución', width: 160 },
  { id: 'date', label: 'Fecha de ejecución', width: 260 },
  { id: 'isActive', label: 'Estado', width: 140 },
  { id: 'actions', label: 'Acciones', width: 110 },
]

export const defaultFilters: ICouncilTableFilters = {
  name: undefined,
  state: undefined,
  startDate: undefined,
  endDate: undefined,
  dateType: undefined,
  type: undefined,
}

export const NewCouncilSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es requerido'),
  date: Yup.date().required('La fecha es requerida'),
  type: Yup.string().required('El tipo es requerido'),
  isActive: Yup.boolean().required('El estado es requerido'),
  isArchived: Yup.boolean().required('El estado es requerido'),
})

export const resolveDefaultValues = (currentCouncil?: ICouncil) => ({
  name: currentCouncil?.name || '',
  date: currentCouncil?.date || new Date(Date.now()),
  type: currentCouncil?.type || CouncilType.ORDINARY,
  isActive: !!currentCouncil?.isActive || true,
  isArchived: !!currentCouncil?.isArchived,
  members:
    currentCouncil?.members?.reduce(
      (acc: Record<string, any>, member: ICouncilAttendee) => {
        acc[member.positionName] = {
          ...member,
          member: {
            ...member.functionary,
            label: `${member?.functionary?.firstName} ${member?.functionary?.firstLastName} ${member?.functionary?.secondLastName} - ${member?.functionary?.dni}`,
            id: member.functionary?.id,
          },
          label: `${member?.functionary?.firstName} ${member?.functionary?.firstLastName} ${member?.functionary?.secondLastName} - ${member?.functionary?.dni}`,
          id: member.functionary?.id,
        }

        return acc
      },
      {},
    ) || {},
})
