import { useCouncilsStore } from '../store/councilsStore'
import { ICouncil, ICouncilFormValues } from '../../domain/entities/ICouncil'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { enqueueSnackbar } from 'notistack'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { IFunctionary } from '../../../functionaries/domain/entities/IFunctionary'
import useModulesStore from '../../../../shared/store/modulesStore'
import { useAccountStore } from '../../../auth/presentation/state/useAccountStore'
import { NewCouncilSchema, resolveDefaultValues } from '../constants'
import { FunctionaryUseCasesImpl } from '../../../functionaries/domain/usecases/FunctionaryServices'
import { useDebounce } from '../../../../shared/hooks/use-debounce'
import { useDefaultMembersStore } from '../../../default-members/presentation/store/defaultMembersStore'
import { DefaultMembersUseCasesImpl } from '../../../default-members/domain/usecases/DefaultMemberServices'
import { resolveModuleId } from '../../../../shared/utils/ModuleUtil'

export const useCouncilsForm = (currentCouncil?: ICouncil) => {
  const router = useRouter()
  const pathname = usePathname()
  const { codeModule } = useParams()

  const { councils, setCouncils, createCouncil, updateCouncil } =
    useCouncilsStore()

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

  const defaultValues: ICouncilFormValues = useMemo(
    () => resolveDefaultValues(defaultMembers, currentCouncil),
    [currentCouncil],
  )
  const methods = useForm<ICouncilFormValues>({
    // @ts-expect-error - The resolver is not being recognized
    resolver: yupResolver(NewCouncilSchema),
    defaultValues,
  })
  const values = methods.watch()

  const onSubmit = useCallback(
    async (data: ICouncilFormValues) => {
      try {
        let result
        if (!currentCouncil?.id) {
          result = await createCouncil({
            ...data,
            moduleId: moduleIdentifier ?? 0,
            userId: user?.id as number,
          })
        } else {
          result = await updateCouncil(
            {
              ...data,
              id: currentCouncil.id,
            },
            currentCouncil,
          )
        }

        if (!!result && !!result.id) {
          router.push(
            currentCouncil
              ? pathname.replace(new RegExp(`/${currentCouncil.id}/edit`), '')
              : pathname.replace('/new', ''),
          )
        }
      } finally {
        methods.reset()
      }
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
    if (searchDebounced.includes('-')) {
      return
    }

    FunctionaryUseCasesImpl.getInstance()
      .getByFilters({ field: searchDebounced })
      .then((result) => {
        if (!isMounted) return

        if (result.functionaries.length > 0) {
          // const usedFunctionaries = methods.getValues().members

          // const filteredFunctionaries = result.functionaries.filter(
          //   (functionary) =>
          //     usedFunctionaries?.every(
          //       (attendee) =>
          //         attendee?.member?.label?.split('-')[1] !== functionary.dni,
          //     ),
          // )

          setUnusedFunctionaries(result.functionaries)
        } else {
          setUnusedFunctionaries([])
        }
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
  }, [])

  return {
    councils,
    methods,
    unusedFunctionaries,
    defaultValues,
    setCouncils,
    onSubmit,
    setSearchField,
    defaultMembers,
    pathname,
  }
}
