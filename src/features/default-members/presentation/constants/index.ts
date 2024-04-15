import * as Yup from 'yup'
import { ICouncilAttendee } from '../../domain/entities/ICouncilAttendee'
import {
  CouncilAttendanceRole,
  CouncilType,
  ICouncil,
} from '../../domain/entities/DefaultMembers'
import { FunctionaryModel } from '../../../functionaries/data/models/FunctionatyModel'
import { ICouncilTableFilters } from '../components/CouncilTableToolbar'

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
  president: Yup.string().required('El presidente es requerido'),
  attendees: Yup.array()
    .of(Yup.string())
    .required('Los asistentes son requeridos'),
})

const findPresident = (
  attendees: ICouncilAttendee[],
): FunctionaryModel | undefined => {
  const presidentAttendee = attendees.find(
    (attendee: ICouncilAttendee) =>
      attendee.role === CouncilAttendanceRole.PRESIDENT,
  )

  if (!presidentAttendee) {
    return undefined
  }

  return presidentAttendee.functionary
}

const findSubrogate = (attendees: ICouncilAttendee[]) => {
  const subrogateAttendee = attendees.find(
    (attendee: ICouncilAttendee) =>
      attendee.role === CouncilAttendanceRole.SUBROGATE,
  )

  if (!subrogateAttendee) {
    return undefined
  }

  return subrogateAttendee.functionary
}

const filterMembers = (attendees: ICouncilAttendee[]) =>
  attendees.filter(
    (attendee: ICouncilAttendee) =>
      attendee.role === CouncilAttendanceRole.MEMBER,
  )

export const resolveDefaultValues = (currentCouncil?: ICouncil) => {
  const president = findPresident(
    (currentCouncil?.attendees as ICouncilAttendee[]) || [],
  )

  const subrogate = findSubrogate(
    (currentCouncil?.attendees as ICouncilAttendee[]) || [],
  )

  const members = filterMembers(
    (currentCouncil?.attendees as ICouncilAttendee[]) || [],
  )

  return {
    name: currentCouncil?.name || '',
    date: currentCouncil?.date || new Date(Date.now()),
    type: currentCouncil?.type || CouncilType.ORDINARY,
    isActive: currentCouncil?.isActive || true,
    isArchived: currentCouncil?.isArchived || false,
    president: president
      ? `${president.firstName} ${president.secondName} ${president.firstLastName} ${president.secondLastName} - ${president.dni}`
      : '',
    subrogant: subrogate
      ? `${subrogate.firstName} ${subrogate.secondName} ${subrogate.firstLastName} ${subrogate.secondLastName} - ${subrogate.dni}`
      : '',
    attendees: members?.map(
      (member) =>
        `${member.functionary.firstName} ${member.functionary.secondName} ${member.functionary.firstLastName} ${member.functionary.secondLastName} - ${member.functionary.dni}`,
    ),
  }
}
