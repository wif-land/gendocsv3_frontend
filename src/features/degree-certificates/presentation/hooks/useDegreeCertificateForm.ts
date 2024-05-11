import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDegreeCertificatesStore } from '../store/degreeCertificatesStore'
import { useForm } from 'react-hook-form'
import {
  FormValuesProps,
  NewDegreeCertificateSchema,
  resolveDefaultValues,
} from '../constants'

import { useRouter } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { useDebounce } from '../../../../shared/hooks/use-debounce'
import { yupResolver } from '@hookform/resolvers/yup'
import { DegreeCertificatesUseCasesImpl } from '../../domain/usecases/DegreeCertificatesUseCases'
import { StudentUseCasesImpl } from '../../../../features/students/domain/usecases/StudentServices'
import { useCertificateData } from '../../../../core/providers/certificate-degree-provider'
import { useDegreeCertificateMethods } from './useDegreeCertificateMethods'
import { useStudentStore } from '../../../students/presentation/state/studentStore'
import { IDegreeCertificate } from '../../domain/entities/IDegreeCertificates'

export const useDegreeCertificateForm = (
  currentDegreeCertificate?: IDegreeCertificate,
) => {
  const [inputValue, setInputValue] = useState('' as string)
  const debouncedValue = useDebounce(inputValue)
  const isOpen = useBoolean()
  const [loading, setIsLoading] = useState(false)
  const { students, setStudents } = useStudentStore()
  const { certificateStatuses, certificateTypes, degreeModalities, rooms } =
    useCertificateData()

  const defaultValues = useMemo(
    () => resolveDefaultValues(currentDegreeCertificate),
    [currentDegreeCertificate],
  )
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewDegreeCertificateSchema),
    defaultValues,
  })

  const router = useRouter()
  const { addDegreeCertificate } = useDegreeCertificatesStore()
  const { resolveStudentById } = useDegreeCertificateMethods()
  const { reset, handleSubmit, getValues } = methods

  const handleCreate = useCallback(async (values: IDegreeCertificate) => {
    await DegreeCertificatesUseCasesImpl.getInstance().create(values)
  }, [])

  const onSubmit = useCallback(
    async (data: IDegreeCertificate) => {
      const formattedData = {
        ...data,
        degreeModality: degreeModalities.find(
          (modality) => modality.id === data.degreeModality,
        )?.id,
      }
      console.log(data)
      console.log({ formattedData })
      // if (!currentDegreeCertificate) {
      //   await handleCreate(data)
      // } else {
      //   // const editFields = getEditedFields<IDegreeCertificate>(defaultValues, data)
      // }

      // const newPath = currentDegreeCertificate
      //   ? pathname.replace(
      //       new RegExp(`/${currentDegreeCertificate.id}/edit`),
      //       '',
      //     )
      //   : pathname.replace('/new', '')

      // router.push(newPath)
      // reset()
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
    const studentId = methods.watch('selectedValue')?.id

    if (!studentId || studentId === 0) return

    // TODO: The selectedValue is from the select component to get the student, if the student is not found, it should be fetched from the API
    resolveStudentById(studentId).then((student) => {
      console.log({ student })

      // TODO: The student should be set in the form with the data fetched from the store or from the API
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
