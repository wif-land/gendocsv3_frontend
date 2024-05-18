/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { useSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import useLoaderStore from '../../../../shared/store/useLoaderStore'
import {
  FormValuesProps,
  NewFunctionarySchema,
  resolveDefaultValues,
  handleCreate,
  handleUpdate,
} from '../constants'
import { resolveEditedFields } from '../../../../shared/utils/FormUtil'
import { IUser } from '../../domain/entities/IUser'
import { useUsersStore } from '../state/usersStore'

export const useUsersForm = (currentUser?: IUser) => {
  const router = useRouter()
  const pathname = usePathname()
  const { users } = useUsersStore()
  const { enqueueSnackbar } = useSnackbar()
  const { loader } = useLoaderStore()

  const defaultValues = useMemo(
    () => resolveDefaultValues(currentUser),
    [currentUser],
  )

  const methods = useForm<FormValuesProps>({
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    resolver: yupResolver(NewFunctionarySchema),
    defaultValues,
  })

  const { reset, handleSubmit } = methods

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      let result

      if (!currentUser) {
        result = await handleCreate(data)
      } else {
        const editedFields = resolveEditedFields<FormValuesProps>(
          defaultValues,
          data,
        )

        result = await handleUpdate({ ...editedFields, id: currentUser.id })
      }

      if (!result) {
        return
      }

      const newPath = currentUser
        ? pathname.replace(new RegExp(`/${currentUser.id}/edit`), '')
        : pathname.replace('/new', '')

      router.push(newPath)
      reset()
    },
    [currentUser, enqueueSnackbar, reset, router],
  )

  useEffect(() => {
    if (currentUser) {
      reset(defaultValues)
    }
  }, [currentUser, defaultValues, reset])

  return {
    loader,
    users,
    methods,
    onSubmit,
    handleSubmit,
  }
}
