/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { useSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { usePositionStore } from '../state/usePositionStore'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { IPosition } from '../../domain/entities/IPosition'
import {
  FormValuesProps,
  NewFunctionarySchema,
  resolveDefaultValues,
  handleCreate,
  handleUpdate,
} from '../constants'
import { getEditedFields } from '../../../../shared/utils/FormUtil'
import { IFunctionary } from '../../../../features/functionaries/domain/entities/IFunctionary'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { useDebounce } from '../../../../shared/hooks/use-debounce'
import { FunctionaryUseCasesImpl } from '../../../../features/functionaries/domain/usecases/FunctionaryServices'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'

export const useFunctionaryForm = (currentFunctionary?: IPosition) => {
  const router = useRouter()
  const pathname = usePathname()
  const { positions } = usePositionStore()
  const { enqueueSnackbar } = useSnackbar()
  const { loader } = useLoaderStore()
  const [functionaries, setFunctionaries] = useState<IFunctionary[]>([])
  const [inputValue, setInputValue] = useState('' as string)
  const isOpen = useBoolean()
  const [loading, setIsLoading] = useState(false)
  const debouncedValue = useDebounce(inputValue)

  const defaultValues = useMemo(
    () => resolveDefaultValues(currentFunctionary),
    [currentFunctionary],
  )

  const methods = useForm<FormValuesProps>({
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    resolver: yupResolver(NewFunctionarySchema),
    defaultValues,
  })

  const { reset, handleSubmit } = methods

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      if (!currentFunctionary) {
        await handleCreate(data)
      } else {
        const editedFields = getEditedFields<FormValuesProps>(
          defaultValues,
          data,
        )

        await handleUpdate({
          ...editedFields,
          id: currentFunctionary.id,
        })
      }

      const newPath = currentFunctionary
        ? pathname.replace(new RegExp(`/${currentFunctionary.id}/edit`), '')
        : pathname.replace('/new', '')

      router.push(newPath)
      reset()
    },
    [currentFunctionary, enqueueSnackbar, reset, router],
  )

  useEffect(() => {
    if (currentFunctionary) {
      reset(defaultValues)
    }
  }, [currentFunctionary, defaultValues, reset])

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
    loader,
    positions,
    methods,
    onSubmit,
    handleSubmit,
    functionaries,
    setInputValue,
    loading,
    isOpen,
  }
}
