import { useMemo } from 'react'
import {
  AttendanceFormValuesProps,
  NewDegreeCertificateAttendanceSchema,
  resolveDefaultValuesDegreeCertificateAssistance,
} from '../constants'
import { IDegreeCertificate } from '../../domain/entities/IDegreeCertificates'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

export const useDegreeCertificateAttendanceForm = (
  currentDegreeCertificate?: IDegreeCertificate,
) => {
  const defaultValues = useMemo(
    () =>
      resolveDefaultValuesDegreeCertificateAssistance(currentDegreeCertificate),
    [currentDegreeCertificate],
  )
  const methods = useForm<AttendanceFormValuesProps>({
    // @ts-expect-error - The resolver is not being recognized
    resolver: yupResolver(NewDegreeCertificateAttendanceSchema),
    defaultValues,
  })

  const { reset, handleSubmit } = methods

  const onSubmit = () => {
    console.log('onSubmit')
  }

  return {
    methods,
    reset,
    handleSubmit,
    onSubmit,
  }
}
