/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { useSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import useLoaderStore from '../../../../shared/store/useLoaderStore'
import {
  NewStudentSchema,
  resolveDefaultValues,
  handleCreate,
  handleUpdate,
} from '../constants'
import { getEditedFields } from '../../../../shared/utils/FormUtil'

import { useStudentStore } from '../state/studentStore'
import { useCareersStore } from '../../../careers/presentation/state/careerStore'
import { IStudent } from '../../domain/entities/IStudent'

export const useStudentForm = (currentStudent?: IStudent) => {
  const router = useRouter()
  const pathname = usePathname()
  const { students } = useStudentStore()
  const { careers, get } = useCareersStore()
  const { enqueueSnackbar } = useSnackbar()
  const { loader } = useLoaderStore()

  const defaultValues = useMemo(
    () => resolveDefaultValues(currentStudent),
    [currentStudent],
  )

  const methods = useForm<IStudent>({
    // @ts-expect-error - The defaultValues are not being recognized
    resolver: yupResolver(NewStudentSchema),
    defaultValues,
  })

  const { reset, handleSubmit } = methods

  const onSubmit = useCallback(
    async (data: IStudent) => {
      if (!currentStudent) {
        await handleCreate(data)
      } else {
        const editedFields = getEditedFields<Partial<IStudent>>(
          defaultValues,
          data,
        )

        await handleUpdate(currentStudent.id!, editedFields)
      }

      const newPath = currentStudent
        ? pathname.replace(new RegExp(`/${currentStudent.id}/edit`), '')
        : pathname.replace('/new', '')

      router.push(newPath)
      reset()
    },
    [currentStudent, enqueueSnackbar, reset, router],
  )

  useEffect(() => {
    if (currentStudent) {
      reset(defaultValues)
    }
  }, [currentStudent, defaultValues, reset])

  useEffect(() => {
    if (!careers?.length) {
      get()
    }
  }, [])

  return {
    loader,
    students,
    methods,
    onSubmit,
    handleSubmit,
    careers,
  }
}
