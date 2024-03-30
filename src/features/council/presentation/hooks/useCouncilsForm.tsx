import { useCouncilStore } from '../store/councilsStore'
import { CouncilsUseCasesImpl } from '../../domain/usecases/CouncilServices'
import { CouncilAttendanceRole, ICouncil } from '../../domain/entities/ICouncil'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { enqueueSnackbar } from 'notistack'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { IFunctionary } from '../../../functionaries/domain/entities/IFunctionary'
import useModulesStore from '../../../../shared/store/modulesStore'
import { useAccountStore } from '../../../auth/presentation/state/useAccountStore'
import {
  ICouncilAttendee,
  ICreateCouncilAttendee,
} from '../../domain/entities/ICouncilAttendee'
import { NewCouncilSchema, resolveDefaultValues } from '../constants'
import { getEditedFields } from '../../../../shared/utils/FormUtil'
import { IModule } from '../../../modules/types/IModule'
import { FunctionaryUseCasesImpl } from '../../../functionaries/domain/usecases/FunctionaryServices'
import { useDebounce } from '../../../../shared/hooks/use-debounce'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'

interface FormValuesProps extends ICouncil {
  president: string
  subrogant: string
}

const MAX_ATTENDEES = 10
const resolveModuleId = (modules: IModule[], codeModule: string) => {
  const module = modules.find(
    (module) => module.code === (codeModule as string).toUpperCase(),
  )

  return module?.id
}
const getDni = (attendee?: string): string =>
  attendee?.split('-')[1]?.trim() ?? ''

export const useCouncilsForm = (currentCouncil?: ICouncil) => {
  const router = useRouter()
  const pathname = usePathname()
  const { codeModule } = useParams()

  const { councils, addCouncil, setCouncils } = useCouncilStore()
  const { user } = useAccountStore()
  const [searchField, setSearchField] = useState('')

  const moduleIdentifier = resolveModuleId(
    useModulesStore().modules,
    codeModule as string,
  )
  const [unusedFunctionaries, setUnusedFunctionaries] = useState<
    IFunctionary[]
  >([])
  const isOpenPresident = useBoolean()
  const isOpenSubrogant = useBoolean()
  const isOpenMembers = useBoolean()
  const loading = useBoolean()

  const defaultValues: Partial<ICouncil> = useMemo(
    () => resolveDefaultValues(currentCouncil),
    [currentCouncil],
  )
  const methods = useForm<FormValuesProps>({
    // @ts-expect-error - The resolver is not being recognized
    resolver: yupResolver(NewCouncilSchema),
    defaultValues,
  })
  const values = methods.watch()

  const handleAddAttendee = () => {
    const attendees = values.attendees as string[]

    if (attendees.length >= MAX_ATTENDEES) return
    if (attendees.length > 0 && attendees[attendees.length - 1] === '') return

    attendees.push('')
    methods.setValue('attendees', attendees)
  }

  const handleRemoveAttendee = (index: number) => {
    handleDeleteAttendeesQuantity(index)
    const attendees = values.attendees as string[]
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
        functionaryId: getDni(president),
        role: CouncilAttendanceRole.PRESIDENT,
      },
      {
        functionaryId: getDni(subrogant),
        role: CouncilAttendanceRole.SUBROGATE,
      },
    ]

    const result = await CouncilsUseCasesImpl.getInstance().create({
      ...rest,
      moduleId: moduleIdentifier ?? 0,
      userId: user?.id as number,
      attendees: actualAttendees,
    })

    if (!result.council) {
      throw new Error('Error al crear el consejo')
    }

    addCouncil(result.council)
  }

  const handleUpdateCouncil = async (
    id: number,
    editedFields: Partial<FormValuesProps>,
  ) => {
    const { president, subrogant, ...rest } = editedFields

    const attendees = []
    if (president) {
      const presidentId = unusedFunctionaries?.find(
        (functionary) => functionary.dni === getDni(president),
      )

      if (presidentId) {
        attendees.push({
          functionaryId: presidentId,
          role: CouncilAttendanceRole.PRESIDENT,
        })
      }
    }

    if (subrogant) {
      const subrogantId = unusedFunctionaries?.find(
        (functionary) => functionary.dni === getDni(subrogant),
      )

      if (subrogantId) {
        attendees.push({
          functionary: subrogantId,
          role: CouncilAttendanceRole.SUBROGATE,
        })
      }
    }

    await CouncilsUseCasesImpl.getInstance().update(id, {
      ...rest,
      attendees: attendees as ICouncilAttendee[],
    })
  }

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      loading.onTrue()
      try {
        if (!currentCouncil) {
          await handleCreateCouncil(data)
        } else {
          const editedFields = getEditedFields<Partial<FormValuesProps>>(
            defaultValues,
            data,
          )

          if (editedFields) {
            await handleUpdateCouncil(currentCouncil.id as number, editedFields)
          }
        }

        router.push(
          currentCouncil
            ? pathname.replace(new RegExp(`/${currentCouncil.id}/edit`), '')
            : pathname.replace('/new', ''),
        )
        enqueueSnackbar(
          !currentCouncil
            ? 'Consejo creado correctamente'
            : 'Consejo actualizado correctamente',
          { variant: 'success' },
        )
      } catch (error) {
        enqueueSnackbar(
          !currentCouncil
            ? 'Error al crear el consejo'
            : 'Error al actualizar el consejo',
          { variant: 'error' },
        )
      } finally {
        methods.reset()
      }
      loading.onFalse()
    },
    [currentCouncil, enqueueSnackbar, methods.reset, router],
  )

  useEffect(() => {
    if (currentCouncil) {
      methods.reset(defaultValues)
    }
  }, [methods.reset, currentCouncil])

  useEffect(() => {
    if (!unusedFunctionaries) return

    const [president, subrogant, attendees] = [
      unusedFunctionaries.find(
        (functionary) => functionary.dni === getDni(values.president),
      ),
      unusedFunctionaries.find(
        (functionary) => functionary.dni === getDni(values.subrogant),
      ),
      (values.attendees as string[]).map((attendee) =>
        unusedFunctionaries.find(
          (functionary) => functionary.dni === getDni(attendee),
        ),
      ),
    ]

    const currentUnusedFunctionaries = unusedFunctionaries.filter(
      (functionary) =>
        functionary.dni !== president?.dni &&
        functionary.dni !== subrogant?.dni &&
        !attendees.some((attendee) => attendee?.dni === functionary.dni),
    )

    setUnusedFunctionaries(currentUnusedFunctionaries)
  }, [values.attendees, values.president, values.subrogant])

  const searchDebounced = useDebounce(searchField)

  useEffect(() => {
    let isMounted = true
    loading.onTrue()
    FunctionaryUseCasesImpl.getInstance()
      .getByFilters({ field: searchDebounced })
      .then((result) => {
        if (!isMounted) return

        if (result.status === HTTP_STATUS_CODES.OK) {
          const usedFunctionaries = [
            ...(methods.getValues().attendees as string[]),
            methods.getValues().president,
            methods.getValues().subrogant,
          ]
          const attendees = usedFunctionaries.map((attendee) =>
            getDni(attendee),
          )

          const filteredFunctionaries = result.data.functionaries.filter(
            (functionary) => !attendees.includes(functionary.dni),
          )

          setUnusedFunctionaries(filteredFunctionaries)
        } else {
          setUnusedFunctionaries([])
        }
        loading.onFalse()
      })

    return () => {
      isMounted = false
    }
  }, [
    searchDebounced,
    isOpenMembers.value,
    isOpenPresident.value,
    isOpenSubrogant.value,
  ])

  return {
    councils,
    methods,
    unusedFunctionaries,
    defaultValues,
    handleAddAttendees: handleAddAttendee,
    handleRemoveAttendee,
    handleDeleteAttendeesQuantity,
    setCouncils,
    handleUpdateCouncil,
    onSubmit,
    setSearchField,
    loading,
    attendees: {
      president: {
        isOpenPresident,
        handleOpenPresident: isOpenPresident.onTrue,
        handleClosePresident: isOpenPresident.onFalse,
      },
      subrogant: {
        isOpenSubrogant,
        handleOpenSubrogant: isOpenSubrogant.onTrue,
        handleCloseSubrogant: isOpenSubrogant.onFalse,
      },
      members: {
        isOpenMembers,
        handleOpenMembers: isOpenMembers.onTrue,
        handleCloseMembers: isOpenMembers.onFalse,
      },
    },
  }
}
