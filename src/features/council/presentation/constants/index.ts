/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup'
import {
  CouncilType,
  ICouncil,
  ICouncilAttendeeFormValues,
  ICouncilFormValues,
} from '../../domain/entities/ICouncil'
import { ICouncilTableFilters } from '../components/CouncilTableToolbar'
import { ICouncilAttendee } from '../../domain/entities/ICouncilAttendee'
import {
  IDefaultMembers,
  IMember,
} from '../../../default-members/domain/entities/IDefaultMembers'
import { DateUtils } from '@/shared/utils/dateUtils'

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
  startDate: DateUtils.FIRST_DAY_OF_YEAR,
  endDate: undefined,
  type: undefined,
}

export const NewCouncilSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es requerido'),
  date: Yup.date().required('La fecha es requerida'),
  type: Yup.string().required('El tipo es requerido'),
  isActive: Yup.boolean().required('El estado es requerido'),
  isArchived: Yup.boolean().required('El estado es requerido'),
})

export const resolveDefaultValues = (
  defaultMembers: IDefaultMembers[],
  currentCouncil?: ICouncil,
): ICouncilFormValues => ({
  name: currentCouncil?.name || '',
  date: currentCouncil?.date || DateUtils.ONE_DAY_AFTER_NOW,
  type: currentCouncil?.type || CouncilType.ORDINARY,
  isActive: !!currentCouncil?.isActive || true,
  isArchived: !!currentCouncil?.isArchived,
  members: currentCouncil
    ? currentCouncil.members.reduce(
        (
          acc: {
            [key: string]: ICouncilAttendeeFormValues & ICouncilAttendee
          },
          member: ICouncilAttendee,
        ) => {
          acc[member.positionName] = {
            ...member,
            label: `${member?.member?.firstName} ${member?.member?.firstLastName} ${member?.member?.secondLastName} - ${member?.member?.dni}`,
            id: member.member?.id || 0,
          }

          return acc
        },
        {} as {
          [key: string]: ICouncilAttendeeFormValues & ICouncilAttendee
        },
      )
    : defaultMembers.reduce(
        (
          acc: {
            [key: string]: ICouncilAttendeeFormValues & ICouncilAttendee
          },
          member: IDefaultMembers,
        ) => {
          acc[member.positionName] = {
            ...member,
            hasAttended: false,
            hasBeenNotified: false,
            isStudent: false,
            positionOrder: member.positionOrder,
            defaultMemberId: 0,
            positionName: member.positionName,
            member: member.member as IMember,
            label: `${(member?.member as IMember)?.firstName} ${(
              member?.member as IMember
            )?.firstLastName} ${(member?.member as IMember)
              ?.secondLastName} - ${(member?.member as IMember)?.dni}`,
            id: (member.member as IMember)?.id || 0,
          }

          return acc
        },
        {} as {
          [key: string]: ICouncilAttendeeFormValues & ICouncilAttendee
        },
      ),
})
