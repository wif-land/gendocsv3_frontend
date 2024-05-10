import * as Yup from 'yup'
import { CouncilType, ICouncil } from '../../domain/entities/ICouncil'
import { ICouncilTableFilters } from '../components/CouncilTableToolbar'
import { IMember } from '../../../../features/default-members/domain/entities/DefaultMembers'

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
    currentCouncil?.members?.map(
      (member) =>
        `${(member.member as IMember)?.firstName} ${(member.member as IMember)
          ?.secondName} ${(member.member as IMember)?.firstLastName} ${(
          member.member as IMember
        )?.secondLastName} - ${(member.member as IMember)?.dni}`,
    ) || [],
})
