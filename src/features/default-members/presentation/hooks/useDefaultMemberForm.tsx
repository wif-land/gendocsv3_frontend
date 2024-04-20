/* eslint-disable @typescript-eslint/no-unused-vars */
import { DefaultMembersUseCasesImpl } from '../../domain/usecases/DefaultMemberServices'
import { IDefaultMembersToCreate } from '../../domain/entities/DefaultMembers'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { enqueueSnackbar } from 'notistack'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { IFunctionary } from '../../../functionaries/domain/entities/IFunctionary'
import useModulesStore from '../../../../shared/store/modulesStore'

import { NewMemberSchema, resolveDefaultValues } from '../constants'
import { getEditedFields } from '../../../../shared/utils/FormUtil'
import { IModule } from '../../../modules/types/IModule'
import { FunctionaryUseCasesImpl } from '../../../functionaries/domain/usecases/FunctionaryServices'
import { useDebounce } from '../../../../shared/hooks/use-debounce'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'

interface FormValuesProps extends IDefaultMembersToCreate {}

const MAX_ATTENDEES = 10
const resolveModuleId = (modules: IModule[], codeModule: string) => {
  const module = modules.find(
    (module) => module.code === (codeModule as string).toUpperCase(),
  )

  return module?.id
}
const getDni = (member?: string): string => member?.split('-')[1]?.trim() ?? ''

export const useDefaultMembersForm = (
  currentDefaultMembers?: IDefaultMembersToCreate,
) => {
  const router = useRouter()
  const pathname = usePathname()
  const { codeModule } = useParams()

  const [searchField, setSearchField] = useState('')

  const moduleIdentifier = resolveModuleId(
    useModulesStore().modules,
    codeModule as string,
  )
  const [unusedFunctionaries, setUnusedFunctionaries] = useState<
    IFunctionary[]
  >([])
  const isOpenMembers = useBoolean()
  const loading = useBoolean()

  const defaultValues: Partial<IDefaultMembersToCreate> = useMemo(
    () => resolveDefaultValues(currentDefaultMembers),
    [currentDefaultMembers],
  )
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewMemberSchema as any /* eslint-disable-line */),
    defaultValues: defaultValues || { members: [] },
  })
  const values = methods.watch()

  const handleAddMember = () => {
    const members = [...values.members]

    if (members.length >= MAX_ATTENDEES) return
    if (members.some((member) => member.member === '')) return

    members.push({ order: members.length + 1, positionName: '', member: '' })
    methods.setValue('members', members)
  }

  const handleRemoveMember = (index: number) => {
    const members = [...values.members]
    if (index >= 0 && index < members.length) {
      members.splice(index, 1)
      methods.setValue(
        'members',
        members.map((member, idx) => ({ ...member, order: idx + 1 })),
      ) // Reajuste del orden
    }
  }

  const handleDeleteAttendeesQuantity = (index: number) => {
    const members = values.members.map((member) => member.member as string)
    members.splice(index, 1)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreateDefaultMembers = async (values: any) => {
    console.log(values)
    /* try {
      const membersToCreate = values.members.map((member) => ({
        ...member,
        memberDni: getDni(member.member),
      }))

      const result =
        await DefaultMembersUseCasesImpl.getInstance().createByModuleId({
          members: membersToCreate,
          moduleId: moduleIdentifier ?? 0,
        })

      // Manejo de resultados
      if (result.success) {
        enqueueSnackbar('Miembros creados correctamente', {
          variant: 'success',
        })
      } else {
        throw new Error('Error al crear los miembros')
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' })
    }
    */
  }

  /*
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

    await DefaultMembersUseCasesImpl.getInstance().update(id, {
      ...rest,
      attendees: attendees as ICouncilAttendee[],
    })
  }


  const searchDebounced = useDebounce(searchField)

  useEffect(() => {
    let isMounted = true
    loading.onTrue()
    if (searchDebounced.includes('-')) return
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

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      loading.onTrue()
      try {
        if (!currentDefaultMembers) {
          await handleCreateCouncil(data)
        } else {
          const editedFields = getEditedFields<Partial<FormValuesProps>>(
            defaultValues,
            data,
          )

          if (editedFields) {
            await handleUpdateCouncil(
              currentDefaultMembers.id as number,
              editedFields,
            )
          }
        }

        router.push(
          currentDefaultMembers
            ? pathname.replace(
                new RegExp(`/${currentDefaultMembers.id}/edit`),
                '',
              )
            : pathname.replace('/new', ''),
        )
        enqueueSnackbar(
          !currentDefaultMembers
            ? 'Consejo creado correctamente'
            : 'Consejo actualizado correctamente',
          { variant: 'success' },
        )
      } catch (error) {
        enqueueSnackbar(
          !currentDefaultMembers
            ? 'Error al crear el consejo'
            : 'Error al actualizar el consejo',
          { variant: 'error' },
        )
      } finally {
        methods.reset()
      }
      loading.onFalse()
    },
    [currentDefaultMembers, enqueueSnackbar, methods.reset, router],
  )

  useEffect(() => {
    if (currentDefaultMembers) {
      methods.reset(defaultValues)
    }
  }, [methods.reset, currentDefaultMembers])

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

  */

  const onSubmit = {
    handleCreateDefaultMembers,
  }

  return {
    methods,
    unusedFunctionaries,
    defaultValues,
    handleAddAttendees: handleAddMember,
    handleRemoveAttendee: handleRemoveMember,
    handleDeleteAttendeesQuantity,
    // handleUpdateCouncil,
    onSubmit,
    setSearchField,
    loading,
  }
}

export default useDefaultMembersForm

/* eslint-enable @typescript-eslint/no-unused-vars */
