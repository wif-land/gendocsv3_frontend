/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDegreeCertificatesStore } from '../store/degreeCertificatesStore'
import { useForm } from 'react-hook-form'
import {
  FormValuesProps,
  NewDegreeCertificateSchema,
  resolveDefaultValuesDegreeCertificate,
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

  console.log({ user })

  const defaultValues = useMemo(
    () => resolveDefaultValuesDegreeCertificate(currentDegreeCertificate),
    [currentDegreeCertificate],
  )
  const methods = useForm<FormValuesProps>({
    // @ts-expect-error - The resolver is not being recognized
    resolver: yupResolver(NewDegreeCertificateSchema),
    defaultValues,
  })

  const router = useRouter()
  const {
    createDegreeCertificate,
    updateDegreeCertificate,
    checkPresentationDate,
  } = useDegreeCertificatesStore()
  const { reset, handleSubmit } = methods

  const onSubmit = useCallback(
    async (data: ICreateDegreeCertificate) => {
      const formattedData = {
        topic: data.topic,
        presentationDate: data.presentationDate,
        studentId: (data as any).student.id,
        certificateTypeId: data.certificateTypeId,
        certificateStatusId: data.certificateStatusId,
        degreeModalityId: data.degreeModalityId,
        roomId: data.roomId,
        duration: Number(data.duration),
        link: data.link,
        isClosed: data.isClosed,
        userId: user?.id,
      }
      let result
      if (!currentDegreeCertificate) {
        result = await createDegreeCertificate(
          formattedData as ICreateDegreeCertificate,
        )
      } else {
        result = await updateDegreeCertificate({
          ...formattedData,
          auxNumber: undefined,
          number: undefined,
          id: currentDegreeCertificate.id!,
        })
      }

      if (!!result && !currentDegreeCertificate) {
        router.push(pathname.replace('/new', ''))
        reset()
      }

      if (!!result && currentDegreeCertificate) {
        router.push(
          pathname.replace(`/${currentDegreeCertificate.id}/edit`, ''),
        )
        reset()
      }
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

    // return
    // // WTF IS GOING ON HERE?
    // methods.setValue(
    //   'student',
    //   students.find(
    //     (student) => student.id === studentId,
    //   ) as unknown as StudentModel,
    // )

    getStudentById(studentId).then((student) => {
      methods.setValue('student', student)
      methods.trigger('student')
      if (
        student.gender == null ||
        student.startStudiesDate == null ||
        student.internshipHours == null ||
        student.vinculationHours == null
      ) {
        enqueueSnackbar(
          'El estudiante no cuenta con la información necesaria para generar la acta de grado',
          {
            variant: 'warning',
          },
        )
      }
    })

    // return () => {
    //   reset()
    // }
  }, [methods.watch('selectedValue')])

  const refreshStudent = async (studentId: number) => {
    const student = await getStudentById(studentId)
    methods.setValue('student', student)
    methods.trigger('student')
  }

  useEffect(() => {
    if (
      !methods.watch('presentationDate') ||
      Number(methods.watch('degreeModalityId')) === 1
    ) {
      return
    }

    if (!methods.watch('duration') || !methods.watch('roomId')) {
      enqueueSnackbar(
        'Asegurate de asignar una duración y un aula para verificar la disponibilidad de la fecha de presentación',
        {
          variant: 'info',
        },
      )
    }

    checkPresentationDate(
      methods.watch('presentationDate'),
      methods.watch('duration'),
      methods.watch('roomId') as number,
    )
  }, [
    methods.watch('presentationDate'),
    methods.watch('duration'),
    methods.watch('roomId'),
  ])

  return {
    methods,
    defaultValues,
    onSubmit,
    handleSubmit,
    students,
    setInputValue,
    loading,
    isOpen,
    refreshStudent,
  }
}
