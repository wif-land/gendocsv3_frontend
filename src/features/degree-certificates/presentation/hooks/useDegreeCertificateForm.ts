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
import { IDegreeCertificate } from '../../domain/entities/IDegreeCertificates'
import { DegreeCertificatesUseCasesImpl } from '../../domain/usecases/DegreeCertificatesUseCases'
import { StudentUseCasesImpl } from '../../../../features/students/domain/usecases/StudentServices'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { IStudent } from '../../../../features/students/domain/entities/IStudent'

export const useDegreeCertificateForm = (
  currentDegreeCertificate?: IDegreeCertificate,
) => {
  const [inputValue, setInputValue] = useState('' as string)
  const debouncedValue = useDebounce(inputValue)
  const isOpen = useBoolean()
  const [loading, setIsLoading] = useState(false)
  const [students, setStudents] = useState<IStudent[]>([])

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
  const pathname = usePathname()
  const { addDegreeCertificate } = useDegreeCertificatesStore()
  const { reset, handleSubmit } = methods

  const handleCreate = useCallback(async (values: IDegreeCertificate) => {
    const result =
      await DegreeCertificatesUseCasesImpl.getInstance().create(values)

    if (result.degreeCertificate) {
      addDegreeCertificate(result)
      enqueueSnackbar('Acta creada correctamente')
    } else {
      throw new Error('Error al crear el acta')
    }
  }, [])

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      if (!currentDegreeCertificate) {
        await handleCreate(data)
      } else {
        // const editFields = getEditedFields<FormValuesProps>(defaultValues, data)
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
    let isMounted = true
    if (isOpen.value === false) return

    setIsLoading(true)

    const filteredStudents = async (field: string) => {
      await StudentUseCasesImpl.getInstance()
        .getByFilters({ field })
        .then((res) => {
          if (res.status === HTTP_STATUS_CODES.OK && isMounted) {
            setStudents(res.data.students)
          } else {
            setStudents([])
            setIsLoading(false)
            return
          }
        })
    }
    if (debouncedValue.includes('-')) return

    filteredStudents(debouncedValue)
    return () => {
      isMounted = false
    }
  }, [debouncedValue, isOpen.value])

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
