/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { useSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { useFunctionaryStore } from '../state/useFunctionaryStore'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { IFunctionary } from '../../domain/entities/IFunctionary'
import {
  FormValuesProps,
  NewFunctionarySchema,
  resolveDefaultValues,
  handleCreate,
  handleUpdate,
} from '../constants'
import { getEditedFields } from '../../../../shared/utils/FormUtil'

export const useFunctionaryForm = (currentFunctionary?: IFunctionary) => {
  const router = useRouter()
  const pathname = usePathname()
  const { functionaries } = useFunctionaryStore()
  const { enqueueSnackbar } = useSnackbar()
  const { loader } = useLoaderStore()

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

        if (!editedFields) {
          return
        }

        await handleUpdate(currentFunctionary.id!, editedFields)
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

  return {
    loader,
    functionaries,
    methods,
    onSubmit,
    handleSubmit,
  }
}
