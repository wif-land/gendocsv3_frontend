/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ICareer } from '../../domain/entities/ICareer'
import { useFunctionaryStore } from '../../../functionaries/presentation/state/useFunctionaryStore'
import { usePathname, useRouter } from 'next/navigation'
import { useSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { CareersUseCasesImpl } from '../../domain/usecases/CareerServices'
import { useCareersStore } from '../store/careerStore'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { IFunctionary } from '../../../functionaries/domain/entities/IFunctionary'
import { getEditedFields } from '../../../../shared/utils/FormUtil'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { useDebounce } from '../../../../shared/hooks/use-debounce'
import { NewCareerSchema } from '../constants'
import { FunctionaryUseCasesImpl } from '../../../.../../../features/functionaries/domain/usecases/FunctionaryServices'

interface FormValuesProps extends ICareer {}

export const useCareerForm = (currentCareer?: ICareer) => {
  let coordinator = ''
  const [inputValue, setInputValue] = useState('' as string)
  const debouncedValue = useDebounce(inputValue)
  const [loading, setIsLoading] = useState(false)
  const isOpen = useBoolean()

  if (currentCareer?.coordinator) {
    coordinator = `${(currentCareer?.coordinator as IFunctionary).firstName} ${
      (currentCareer?.coordinator as IFunctionary).secondName
    } ${(currentCareer?.coordinator as IFunctionary).firstLastName} ${
      (currentCareer?.coordinator as IFunctionary).secondLastName
    } - ${(currentCareer?.coordinator as IFunctionary).dni}`
  }

  const defaultValues = useMemo(
    () => ({
      name: currentCareer?.name || '',
      credits: currentCareer?.credits || 0,
      menDegree: currentCareer?.menDegree || '',
      womenDegree: currentCareer?.womenDegree || '',
      coordinator: coordinator || '',
      internshipHours: currentCareer?.internshipHours || 0,
      vinculationHours: currentCareer?.vinculationHours || 0,
      isActive: currentCareer?.isActive || true,
    }),
    [currentCareer],
  )

  const router = useRouter()
  const pathname = usePathname()
  const { functionaries, get, setFunctionaries } = useFunctionaryStore()
  const { enqueueSnackbar } = useSnackbar()
  const { addCareer, updateCareer } = useCareersStore()

  const methods = useForm<FormValuesProps>({
    // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'DeepPartial<FormValuesProps> | undefined'.
    resolver: yupResolver(NewCareerSchema),
    defaultValues,
  })

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const handleCreate = useCallback(async (values: ICareer) => {
    const result = await CareersUseCasesImpl.getInstance().create(values)

    if (result.career) {
      addCareer(result.career)
      enqueueSnackbar('Carrera creada exitosamente')
    } else {
      throw new Error('Error al crear el consejo')
    }
  }, [])

  const handleUpdate = async (id: number, editedFields: Partial<ICareer>) => {
    const { status } = await CareersUseCasesImpl.getInstance().update(
      id,
      editedFields,
    )

    if (status === HTTP_STATUS_CODES.OK) {
      updateCareer(editedFields)
      enqueueSnackbar('Carrera actualizada exitosamente')
    } else {
      throw new Error('Error al actualizar el consejo')
    }
  }

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        const functionaryId = functionaries?.find(
          (f) => f.dni === (data.coordinator as string).split('-')[1].trim(),
        )?.id

        if (!currentCareer) {
          await handleCreate({
            ...data,
            coordinator: functionaryId as number,
          })
        } else {
          const editedFields = getEditedFields<FormValuesProps>(
            defaultValues,
            data,
          )

          if (editedFields?.coordinator) {
            editedFields.coordinator = functionaryId as number
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
      } catch (error) {
        enqueueSnackbar('Error al crear la carrera', {
          variant: 'error',
        })
      }
    },
    [currentCareer, enqueueSnackbar, reset, router],
  )

  useEffect(() => {
    if (currentCareer) {
      reset(defaultValues)
    }
  }, [reset, currentCareer, defaultValues])

  useEffect(() => {
    if (!functionaries) {
      get()
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    if (isOpen.value === false) return

    setIsLoading(true)

    const filteredFunctionaries = async (field: string) => {
      await FunctionaryUseCasesImpl.getInstance()
        .getByFilters({ field })
        .then((res) => {
          if (res.status === HTTP_STATUS_CODES.OK && isMounted) {
            setFunctionaries(res.data.functionaries)
            return
          } else {
            setFunctionaries([])
            setIsLoading(false)
            return
          }
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
