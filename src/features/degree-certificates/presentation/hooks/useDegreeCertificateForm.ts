import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDegreeCertificatesStore } from '../store/degreeCertificatesStore'
import { useForm } from 'react-hook-form'
import {
  FormValuesProps,
  NewDegreeCertificateSchema,
  resolveDefaultValues,
} from '../constants'

import { usePathname, useRouter } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { useDebounce } from '../../../../shared/hooks/use-debounce'
import { yupResolver } from '@hookform/resolvers/yup'
import { useStudentStore } from '../../../students/presentation/state/studentStore'
import {
  ICreateDegreeCertificate,
  IDegreeCertificate,
} from '../../domain/entities/IDegreeCertificates'
import { useAccountStore } from '../../../../features/auth/presentation/state/useAccountStore'

export const useDegreeCertificateForm = (
  currentDegreeCertificate?: IDegreeCertificate,
) => {
  const pathname = usePathname()
  const [inputValue, setInputValue] = useState('' as string)
  const debouncedValue = useDebounce(inputValue)
  const isOpen = useBoolean()
  const [loading, setIsLoading] = useState(false)
  const {
    students,
    getById: getStudentById,
    getByFilter: getStudentsByFilter,
  } = useStudentStore()
  const { user } = useAccountStore()

  const defaultValues = useMemo(
    () => resolveDefaultValues(currentDegreeCertificate),
    [currentDegreeCertificate],
  )
  const methods = useForm<FormValuesProps>({
    // @ts-expect-error - The resolver is not being recognized
    resolver: yupResolver(NewDegreeCertificateSchema),
    defaultValues,
  })

  const router = useRouter()
  const { createDegreeCertificate, updateDegreeCertificate } =
    useDegreeCertificatesStore()
  const { reset, handleSubmit } = methods

  const onSubmit = useCallback(
    async (data: ICreateDegreeCertificate) => {
      let result
      if (!currentDegreeCertificate) {
        result = createDegreeCertificate({
          ...data,
          userId: user!.id,
        })
      } else {
        result = updateDegreeCertificate({
          ...data,
          id: currentDegreeCertificate.id,
        })
      }

      if (!!result && !currentDegreeCertificate) {
        router.push(pathname.replace('/new', ''))
      }

      if (!!result && currentDegreeCertificate) {
        router.push(
          pathname.replace(`/${currentDegreeCertificate.id}/edit`, ''),
        )
      }

      reset()
    },
    [currentDegreeCertificate, enqueueSnackbar, reset, router],
  )

  useEffect(() => {
    if (currentDegreeCertificate) {
      reset(defaultValues)
    }
  }, [currentDegreeCertificate, defaultValues, reset])

  useEffect(() => {
    if (isOpen.value === false) return

    setIsLoading(true)

    if (debouncedValue.includes('-')) return

    getStudentsByFilter(debouncedValue)
  }, [debouncedValue, isOpen.value])

  useEffect(() => {
    const studentId = methods.watch('selectedValue')?.id
    if (!studentId || studentId === 0) return

    // WTF IS GOING ON HERE?
    methods.setValue(
      'student',
      students.find((student) => student.id === studentId) as any,
    )
    getStudentById(studentId).then((student) => {
      methods.setValue('student', student)
      methods.trigger('student')
    })

    return () => {
      reset()
    }
  }, [methods.watch('selectedValue')])

  return {
    methods,
    defaultValues,
    onSubmit,
    handleSubmit,
    students,
    setInputValue,
    loading,
    isOpen,
  }
}
