/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { useSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { useFunctionaryStore } from '../state/useFunctionaryStore'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import {
  IFunctionary,
  IFunctionaryFormValues,
} from '../../domain/entities/IFunctionary'
import {
  NewFunctionarySchema,
  resolveDefaultValues,
  handleCreate,
  handleUpdate,
} from '../constants'
import { resolveEditedFields } from '../../../../shared/utils/FormUtil'

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

  const methods = useForm<IFunctionaryFormValues>({
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    resolver: yupResolver(NewFunctionarySchema),
    defaultValues,
  })

  const { reset, handleSubmit } = methods

  const onSubmit = useCallback(
    async (data: IFunctionaryFormValues) => {
      let result
      if (!currentFunctionary) {
        const dataWithoutId = { ...data, id: undefined }
        result = await handleCreate(dataWithoutId as IFunctionaryFormValues)
      } else {
        const editedFields = resolveEditedFields<IFunctionaryFormValues>(
          defaultValues,
          data,
        )

        result = await handleUpdate(
          currentFunctionary.id!,
          editedFields as Partial<IFunctionaryFormValues>,
        )
      }

      if (result.id === 0) {
        return
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
