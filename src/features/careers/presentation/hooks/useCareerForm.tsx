/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ICareer,
  ICareerFormValues,
  ICreateCareer,
} from '../../domain/entities/ICareer'
import { useFunctionaryStore } from '../../../functionaries/presentation/state/useFunctionaryStore'
import { usePathname, useRouter } from 'next/navigation'
import { useSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { CareersUseCasesImpl } from '../../domain/usecases/CareerServices'
import { useCareersStore } from '../store/careerStore'
import { resolveEditedFields } from '../../../../shared/utils/FormUtil'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { useDebounce } from '../../../../shared/hooks/use-debounce'
import { NewCareerSchema, resolveDefaultValues } from '../constants'
import { FunctionaryUseCasesImpl } from '../../../.../../../features/functionaries/domain/usecases/FunctionaryServices'

export const useCareerForm = (currentCareer?: ICareer) => {
  const [inputValue, setInputValue] = useState('' as string)
  const debouncedValue = useDebounce(inputValue)
  const [loading, setIsLoading] = useState(false)
  const isOpen = useBoolean()

  const defaultValues = useMemo(
    () => resolveDefaultValues(currentCareer),
    [currentCareer],
  )

  const router = useRouter()
  const pathname = usePathname()
  const { functionaries, get, setFunctionaries } = useFunctionaryStore()
  const { enqueueSnackbar } = useSnackbar()
  const { addCareer, updateCareer } = useCareersStore()

  const methods = useForm<ICareerFormValues>({
    // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'DeepPartial<FormValuesProps> | undefined'.
    resolver: yupResolver(NewCareerSchema),
    defaultValues,
  })

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const handleCreate = useCallback(async (values: ICreateCareer) => {
    const result = await CareersUseCasesImpl.getInstance().create(values)

    if (result) {
      addCareer(result)
    } else {
      throw new Error('Error al crear el consejo')
    }
  }, [])

  const handleUpdate = async (id: number, editedFields: ICareerFormValues) => {
    const result = await CareersUseCasesImpl.getInstance().update(id, {
      ...editedFields,
      coordinator: editedFields.coordinator.id,
    })

    if (result) {
      updateCareer({
        ...editedFields,
        coordinator: functionaries?.find(
          (f) => f.id === editedFields.coordinator.id,
        ) as any,
      })
    } else {
      throw new Error('Error al actualizar el consejo')
    }
  }

  const onSubmit = useCallback(
    async (data: ICareerFormValues) => {
      if (!currentCareer) {
        await handleCreate({
          ...data,
          coordinator: data.coordinator.id,
        })
      } else {
        const editedFields = resolveEditedFields<ICareerFormValues>(
          {
            ...defaultValues,
            coordinator: {
              id: currentCareer.coordinator.id!,
              label: `${currentCareer.coordinator.firstName} ${currentCareer.coordinator.secondName} ${currentCareer.coordinator.firstLastName} ${currentCareer.coordinator.secondLastName} - ${currentCareer.coordinator.dni}`,
              ...currentCareer.coordinator,
            },
          },
          data,
        )

        if (editedFields?.coordinator) {
          editedFields.coordinator = editedFields.coordinator
        }

        if (editedFields) {
          await handleUpdate(currentCareer.id as number, editedFields)
        }
      }

      router.push(
        currentCareer
          ? pathname.replace(new RegExp(`/${currentCareer.id}/edit`), '')
          : pathname.replace('/new', ''),
      )
      reset()
    },
    [currentCareer, enqueueSnackbar, reset, router],
  )

  useEffect(() => {
    if (currentCareer) {
      reset(defaultValues)
    }
  }, [reset, currentCareer, defaultValues])

  useEffect(() => {
    if (!functionaries.length) {
      get()
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    if (isOpen.value === false) return

    setIsLoading(true)

    if (debouncedValue === '' || !debouncedValue) {
      return
    }

    const filteredFunctionaries = async (field: string) => {
      await FunctionaryUseCasesImpl.getInstance()
        .getByFilters({ field })
        .then((res) => {
          if (isMounted) {
            setFunctionaries(res.functionaries)
            return
          }
          setFunctionaries([])
          setIsLoading(false)
          return
        })
    }

    if (debouncedValue.includes('-')) return

    filteredFunctionaries(debouncedValue)

    return () => {
      isMounted = false
    }
  }, [debouncedValue, isOpen.value])

  return {
    functionaries,
    isSubmitting,
    methods,
    onSubmit,
    handleSubmit,
    setInputValue,
    isOpen,
    loading,
  }
}
