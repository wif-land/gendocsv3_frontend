import * as Yup from 'yup'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { useCouncilStore } from '../store/councilsStore'
import { CouncilsUseCasesImpl } from '../../domain/usecases/CouncilServices'
import {
  CouncilAttendanceRole,
  CouncilType,
  ICouncil,
} from '../../domain/entities/ICouncil'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { enqueueSnackbar } from 'notistack'
import { useFunctionaryStore } from '../../../../shared/store/functionaryStore'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { IFunctionary } from '../../../functionaries/domain/entities/IFunctionary'
import useModulesStore from '../../../../shared/store/modulesStore'
import { useAccountStore } from '../../../auth/presentation/state/useAccountStore'
import {
  ICouncilAttendee,
  ICreateCouncilAttendee,
} from '../../domain/entities/ICouncilAttendee'

interface FormValuesProps extends ICouncil {
  president: string
  subrogant: string
}

const MAX_ATTENDEES = 10

export const useCouncilsForm = (currentCouncil?: ICouncil) => {
  const { councils, addCouncil, setCouncils } = useCouncilStore()
  const { codeModule } = useParams()
  const { user } = useAccountStore()
  const { modules } = useModulesStore()
  const moduleIdentifier =
    modules?.find(
      (module) => module.code === (codeModule as string).toUpperCase(),
    )?.id ?? 0
  const { functionaries, get } = useFunctionaryStore()
  const [unusedFunctionaries, setUnusedFunctionaries] = useState<
    IFunctionary[]
  >([])
  const router = useRouter()
  const pathname = usePathname()
  const NewCouncilSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es requerido'),
    date: Yup.date().required('La fecha es requerida'),
    type: Yup.string().required('El tipo es requerido'),
    isActive: Yup.boolean().required('El estado es requerido'),
    isArchived: Yup.boolean().required('El estado es requerido'),
    president: Yup.string().required('El presidente es requerido'),
    subrogant: Yup.string().required('El subrogante es requerido'),
    attendees: Yup.array()
      .of(Yup.string())
      .required('Los asistentes son requeridos'),
  })

  const findPresident = (attendees: ICouncilAttendee[]) =>
    attendees.find(
      (attendee: ICouncilAttendee) =>
        attendee.role === CouncilAttendanceRole.PRESIDENT,
    )?.functionary

  const findSubrogate = (attendees: ICouncilAttendee[]) =>
    attendees.find(
      (attendee) => attendee.role === CouncilAttendanceRole.SUBROGATE,
    )?.functionary

  const filterMembers = (attendees: ICouncilAttendee[]) =>
    attendees.filter(
      (attendee) => attendee.role === CouncilAttendanceRole.MEMBER,
    )

  const president = useMemo(
    () =>
      findPresident((currentCouncil?.attendees as ICouncilAttendee[]) || []),
    [currentCouncil],
  )
  const subrogate = useMemo(
    () =>
      findSubrogate((currentCouncil?.attendees as ICouncilAttendee[]) || []),
    [currentCouncil],
  )
  const members = useMemo(
    () =>
      filterMembers((currentCouncil?.attendees as ICouncilAttendee[]) || []),
    [currentCouncil],
  )

  const defaultValues = useMemo(
    () => ({
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
      attendees: members.map(
        (member) =>
          `${member.functionary.firstName} ${member.functionary.secondName} ${member.functionary.firstLastName} ${member.functionary.secondLastName} - ${member.functionary.dni}`,
      ),
    }),
    [currentCouncil, president, subrogate, members],
  )

  const methods = useForm<FormValuesProps>({
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    resolver: yupResolver(NewCouncilSchema),
    defaultValues,
  })

  const { reset, watch } = methods
  const values = watch()

  const handleAddAttendees = () => {
    const attendees = values.attendees as string[]

    if (attendees.length >= MAX_ATTENDEES) return
    if (attendees.length > 0 && attendees[attendees.length - 1] === '') return

    attendees.push('')
    methods.setValue('attendees', attendees)
  }

  const handleDeleteAttendeesQuantity = (index: number) => {
    const attendees = values.attendees as string[]
    attendees.splice(index, 1)
  }

  const handleCreateCouncil = async (values: FormValuesProps) => {
    const { president, subrogant, ...rest } = values

    const actualAttendees: ICreateCouncilAttendee[] = [
      {
        functionaryId: functionaries?.find(
          (functionary) => functionary.dni === president.split('-')[1].trim(),
        )?.id as number,
        role: CouncilAttendanceRole.PRESIDENT,
      },
      {
        functionaryId: functionaries?.find(
          (functionary) => functionary.dni === subrogant.split('-')[1].trim(),
        )?.id as number,
        role: CouncilAttendanceRole.SUBROGATE,
      },
    ]

    const result = await CouncilsUseCasesImpl.getInstance().create({
      ...rest,
      moduleId: moduleIdentifier,
      userId: user?.id as number,
      attendees: actualAttendees,
    })

    console.log(`Back Response: ${JSON.stringify(result, null, 2)} `)

    if (!result.council) {
      throw new Error('Error al crear el consejo')
    }

    addCouncil(result.council)
    enqueueSnackbar('Consejo creado exitosamente')
  }

  const handleUpdateCouncil = async (
    id: number,
    editedFields: Partial<FormValuesProps>,
  ) => {
    const { president, subrogant, ...rest } = editedFields

    const attendees = []
    if (president) {
      const presidentId = functionaries?.find(
        (functionary) => functionary.dni === president.split('-')[1].trim(),
      )?.id
      if (presidentId) {
        attendees.push({
          functionaryId: presidentId,
          role: CouncilAttendanceRole.PRESIDENT,
        })
      }
    }
    if (subrogant) {
      const subrogantId = functionaries?.find(
        (functionary) => functionary.dni === subrogant.split('-')[1].trim(),
      )

      if (subrogantId) {
        attendees.push({
          functionary: subrogantId,
          role: CouncilAttendanceRole.SUBROGATE,
        })
      }
    }
    // TODO: check the rest of attendees and add them to the list

    const { status } = await CouncilsUseCasesImpl.getInstance().update(id, {
      ...rest,
      attendees: attendees as ICouncilAttendee[],
    })

    if (status !== HTTP_STATUS_CODES.OK) {
      enqueueSnackbar('Error al actualizar el consejo', { variant: 'error' })
      return
    }

    enqueueSnackbar('Consejo actualizado exitosamente')
  }

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        if (!currentCouncil) {
          await handleCreateCouncil(data)
        } else {
          await handleUpdateCouncil(currentCouncil.id as number, data)
        }

        router.push(
          currentCouncil
            ? pathname.replace(new RegExp(`/${currentCouncil.id}/edit`), '')
            : pathname.replace('/new', ''),
        )
        reset()
      } catch (error) {
        enqueueSnackbar(
          !currentCouncil
            ? 'Error al crear el consejo'
            : 'Error al actualizar el consejo',
          { variant: 'error' },
        )
      }
    },
    [currentCouncil, enqueueSnackbar, reset, router],
  )

  useEffect(() => {
    if (currentCouncil) {
      reset(defaultValues)
    }
  }, [reset, currentCouncil])

  const getDni = (attendee?: string) => attendee?.split('-')[1].trim() || ''

  useEffect(() => {
    if (!functionaries) return

    const [president, subrogant, attendees] = [
      functionaries.find(
        (functionary) => functionary.dni === getDni(values.president),
      ),
      functionaries.find(
        (functionary) => functionary.dni === getDni(values.subrogant),
      ),
      (values.attendees as string[]).map((attendee) =>
        functionaries.find(
          (functionary) => functionary.dni === getDni(attendee),
        ),
      ),
    ]

    const currentUnusedFunctionaries = functionaries.filter(
      (functionary) =>
        functionary.dni !== president?.dni &&
        functionary.dni !== subrogant?.dni &&
        !attendees.some((attendee) => attendee?.dni === functionary.dni),
    )

    setUnusedFunctionaries(currentUnusedFunctionaries)
  }, [values.attendees, values.president, values.subrogant])

  useEffect(() => {
    if (!functionaries) {
      get()
      return
    }

    setUnusedFunctionaries(functionaries)
  }, [])

  return {
    councils,
    methods,
    unusedFunctionaries,
    defaultValues,
    handleAddAttendees,
    handleDeleteAttendeesQuantity,
    setCouncils,
    handleUpdateCouncil,
    onSubmit,
  }
}
