import { useCouncilStore } from '../store/councilsStore'
import { CouncilsUseCasesImpl } from '../../domain/usecases/CouncilServices'
import { ICouncil } from '../../domain/entities/ICouncil'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { enqueueSnackbar } from 'notistack'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { IFunctionary } from '../../../functionaries/domain/entities/IFunctionary'
import useModulesStore from '../../../../shared/store/modulesStore'
import { useAccountStore } from '../../../auth/presentation/state/useAccountStore'
import { NewCouncilSchema, resolveDefaultValues } from '../constants'
import { getEditedFields } from '../../../../shared/utils/FormUtil'
import { FunctionaryUseCasesImpl } from '../../../functionaries/domain/usecases/FunctionaryServices'
import { useDebounce } from '../../../../shared/hooks/use-debounce'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { useDefaultMembersStore } from '../../../default-members/presentation/store/defaultMembersStore'
import { DefaultMembersUseCasesImpl } from '../../../default-members/domain/usecases/DefaultMemberServices'
import { resolveModuleId } from '../../../../shared/utils/ModuleUtil'

interface FormValuesProps extends ICouncil {}

export const useCouncilsForm = (currentCouncil?: ICouncil) => {
  const router = useRouter()
  const pathname = usePathname()
  const { codeModule } = useParams()

  const { councils, addCouncil, setCouncils } = useCouncilStore()

  const { defaultMembers, setDefaultMembers } = useDefaultMembersStore()
  const moduleIdentifier = resolveModuleId(
    useModulesStore().modules,
    codeModule as string,
  )

  const { user } = useAccountStore()
  const [searchField, setSearchField] = useState('')

  const [unusedFunctionaries, setUnusedFunctionaries] = useState<
    IFunctionary[]
  >([])
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

  const handleCreateCouncil = async (values: FormValuesProps) => {
    const council = await CouncilsUseCasesImpl.getInstance().create({
      ...values,
      moduleId: moduleIdentifier ?? 0,
      userId: user?.id as number,
      members: values.members,
    })

    addCouncil(council)
  }

  const handleUpdateCouncil = async (
    id: number,
    editedFields: Partial<FormValuesProps>,
  ) => {
    await CouncilsUseCasesImpl.getInstance().update(id, editedFields)
  }

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      loading.onTrue()
      console.log(data)
      try {
        if (!currentCouncil) {
          await handleCreateCouncil({
            ...data,
            /**
             * {
             *  'Position': {
             *  id: 1, label: 'position', positionOrder: 1,
             *   }
             * }
             */
            members: Object.entries(data.members).map(
              ([positionName, member]) => ({
                positionName,
                member: member.id,
                positionOrder: member.positionOrder,
              }),
            ),
          })
        } else {
          const editedFields = getEditedFields<Partial<FormValuesProps>>(
            defaultValues,
            {
              ...data,
              members: Object.entries(data.members).map(
                ([positionName, member]) => ({
                  positionName,
                  member: member.id,
                  positionOrder: member.positionOrder,
                }),
              ),
            },
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
        console.log(error)
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

    // const attendees = values.members?.map((attendee) =>
    //   unusedFunctionaries.find(
    //     (functionary) => functionary.dni === (attendee?.member as IMember)?.dni,
    //   ),
    // )

    // const currentUnusedFunctionaries = unusedFunctionaries.filter(
    //   (functionary) =>
    //     !attendees?.some((attendee) => attendee?.dni === functionary.dni),
    // )

    setUnusedFunctionaries([])
  }, [values.members])

  const searchDebounced = useDebounce(searchField)

  useEffect(() => {
    let isMounted = true
    loading.onTrue()
    if (searchDebounced.includes('-')) return
    if (
      !searchDebounced ||
      searchDebounced === '' ||
      searchDebounced.length < 1
    ) {
      return
    }

    FunctionaryUseCasesImpl.getInstance()
      .getByFilters({ field: searchDebounced })
      .then((result) => {
        if (!isMounted) return

        if (result.functionaries.length > 0) {
          const usedFunctionaries = methods.getValues().members

          console.log({ usedFunctionaries })

          // const filteredFunctionaries = result.functionaries.filter(
          //   (functionary) =>
          //     usedFunctionaries?.every(
          //       (attendee) =>
          //         attendee?.member?.label?.split('-')[1] !== functionary.dni,
          //     ),
          // )

          // console.log({ filteredFunctionaries })

          setUnusedFunctionaries(result.functionaries)
        } else {
          setUnusedFunctionaries([])
        }
        loading.onFalse()
      })

    return () => {
      isMounted = false
    }
  }, [searchDebounced])

  useEffect(() => {
    DefaultMembersUseCasesImpl.getInstance()
      .getByModuleId(moduleIdentifier!)
      .then((result) => {
        setDefaultMembers(result)
      })
    console.log({ currentCouncil })
    if (currentCouncil?.members.length) return
    methods.setValue(
      'members',
      defaultMembers.reduce((acc, member) => {
        acc[member.positionName] = {
          ...(member.member as object),
          label: `${member.member?.firstName} ${member.member?.firstLastName} ${member.member?.secondLastName} - ${member.member?.dni}`,
          id: member.member?.id,
          positionOrder: member.positionOrder,
        }

        return acc
      }, {}),
    )
  }, [])

  return {
    councils,
    methods,
    unusedFunctionaries,
    defaultValues,
    setCouncils,
    handleUpdateCouncil,
    onSubmit,
    setSearchField,
    loading,
    defaultMembers,
    pathname,
  }
}
