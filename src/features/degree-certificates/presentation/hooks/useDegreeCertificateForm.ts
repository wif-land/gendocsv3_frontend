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
import { DegreeCertificatesUseCasesImpl } from '../../domain/usecases/DegreeCertificatesUseCases'
import { StudentUseCasesImpl } from '../../../../features/students/domain/usecases/StudentServices'
import { useDegreeCertificateMethods } from './useDegreeCertificateMethods'
import { useStudentStore } from '../../../students/presentation/state/studentStore'
import { IDegreeCertificate } from '../../domain/entities/IDegreeCertificates'
import { useAccountStore } from '../../../../features/auth/presentation/state/useAccountStore'

export const useDegreeCertificateForm = (
  currentDegreeCertificate?: IDegreeCertificate,
) => {
  const pathname = usePathname()
  const [inputValue, setInputValue] = useState('' as string)
  const debouncedValue = useDebounce(inputValue)
  const isOpen = useBoolean()
  const [loading, setIsLoading] = useState(false)
  const { students, setStudents } = useStudentStore()
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
  const { addDegreeCertificate } = useDegreeCertificatesStore()
  const { resolveStudentById } = useDegreeCertificateMethods()
  const { reset, handleSubmit } = methods

  const handleCreate = useCallback(async (values: IDegreeCertificate) => {
    const degree =
      await DegreeCertificatesUseCasesImpl.getInstance().create(values)
    addDegreeCertificate(degree)
  }, [])

  const handleEdit = useCallback(
    async (values: Partial<IDegreeCertificate>) => {
      const degree =
        await DegreeCertificatesUseCasesImpl.getInstance().update(values)
      addDegreeCertificate(degree)
    },
    [],
  )

  const removeUndefinedFields = <T>(obj: T): Partial<T> => {
    const newObj: Partial<T> = {}
    for (const key in obj) {
      if (
        obj[key as keyof T] !== undefined &&
        obj[key as keyof T] !== null &&
        obj[key as keyof T] !== ''
      ) {
        newObj[key as keyof T] = obj[key as keyof T]
      }
    }
    return newObj
  }

  const formatData = useCallback(
    (data: Partial<IDegreeCertificate>) => {
      const formattedData: Partial<IDegreeCertificate> = removeUndefinedFields({
        topic: data.topic,
        presentationDate: data.presentationDate,
        studentId: data.student?.id,
        certificateTypeId: data.certificateType,
        certificateStatusId: data.certificateStatus,
        degreeModalityId: data.degreeModality,
        roomId: data.room,
        duration: Number(data.duration),
        isClosed: data.isClosed,
        userId: user?.id,
        link: data.link,
      })

      return formattedData
    },
    [user, currentDegreeCertificate],
  )

  const onSubmit = useCallback(
    async (data: IDegreeCertificate) => {
      const formattedData = formatData(data)
      if (!currentDegreeCertificate) {
        handleCreate(formattedData as unknown as IDegreeCertificate)
      } else {
        handleEdit({
          ...formattedData,
          id: currentDegreeCertificate.id,
        })
      }

      const newPath = currentDegreeCertificate
        ? pathname.replace(
            new RegExp(`/${currentDegreeCertificate.id}/edit`),
            '',
          )
        : pathname.replace('/new', '')

      router.push(newPath)
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

    const filteredStudents = async (field: string) => {
      await StudentUseCasesImpl.getInstance()
        .getByFilters({ field })
        .then((res) => {
          setStudents(res.students)
        })
    }
    if (debouncedValue.includes('-')) return

    filteredStudents(debouncedValue)
  }, [debouncedValue, isOpen.value])

  useEffect(() => {
    if (currentDegreeCertificate) return
    const studentId = methods.watch('selectedValue')?.id

    if (!studentId || studentId === 0) return

    // TODO: The selectedValue is from the select component to get the student, if the student is not found, it should be fetched from the API
    resolveStudentById(studentId).then((student) => {
      methods.setValue('student', student)
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
