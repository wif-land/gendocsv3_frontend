import { useEffect, useMemo, useState } from 'react'
import {
  AttendanceFormValuesProps,
  NewDegreeCertificateAttendanceSchema,
  resolveDefaultValuesDegreeCertificateAttendee,
} from '../constants'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { IFunctionary } from '../../../functionaries/domain/entities/IFunctionary'
import { useDebounce } from '../../../../shared/hooks/use-debounce'
import { FunctionaryUseCasesImpl } from '../../../functionaries/domain/usecases/FunctionaryServices'
import { CreateDegreeCertificateAttendanceUseCase } from '../../domain/usecases/CreateDegreeCertificateAttendance'
import { IDegreeCertificatesAttendee } from '../../domain/entities/IDegreeCertificateAttendee'
import { EditDegreeCertificateAttendanceUseCase } from '../../domain/usecases/EditDegreeCertificateAttendance'
import { useDegreeCertificateStore } from '../store/useDegreeCertificateStore'
import { PaginationDTO } from '../../../../shared/utils/pagination-dto'

export const useDegreeCertificateAttendanceForm = (
  currentAttendee?: IDegreeCertificatesAttendee,
  currentDegreeCertificateId?: number,
  onClose?: VoidFunction,
) => {
  const [unusedFunctionaries, setUnusedFunctionaries] = useState<
    IFunctionary[]
  >([])
  const [searchField, setSearchField] = useState('')
  const searchDebounced = useDebounce(searchField)
  const { getDegreeCertificate } = useDegreeCertificateStore()

  const defaultValues = useMemo(
    () => resolveDefaultValuesDegreeCertificateAttendee(currentAttendee),
    [currentAttendee],
  )
  const methods = useForm<AttendanceFormValuesProps>({
    // @ts-expect-error - The resolver is not being recognized
    resolver: yupResolver(NewDegreeCertificateAttendanceSchema),
    defaultValues,
  })

  const { reset, handleSubmit } = methods

  const onSubmit = async (data: AttendanceFormValuesProps) => {
    if (currentAttendee) {
      await new EditDegreeCertificateAttendanceUseCase().call({
        ...data,
        id: currentAttendee.id,
        degreeCertificateId: +currentDegreeCertificateId!,
      })
    } else {
      await new CreateDegreeCertificateAttendanceUseCase().call({
        ...data,
        degreeCertificateId: +currentDegreeCertificateId!,
      })
    }

    await getDegreeCertificate(+currentDegreeCertificateId!)
    onClose?.()
    reset()
  }

  useEffect(() => {
    let isMounted = true
    if (searchDebounced.includes('-')) {
      return
    }

    FunctionaryUseCasesImpl.getInstance()
      .getByFilters({ field: searchDebounced }, new PaginationDTO())
      .then((result) => {
        if (!isMounted) return

        if (result.functionaries.length > 0) {
          const usedFunctionariesIds = Object.entries(
            methods.getValues().functionary || {},
          )
            .map(([_, data]) => data?.id)
            .filter((val) => val)

          setUnusedFunctionaries(
            result.functionaries.filter(
              (functionary) => !usedFunctionariesIds.includes(functionary.id),
            ),
          )
        } else {
          setUnusedFunctionaries([])
        }
      })

    return () => {
      isMounted = false
    }
  }, [searchDebounced])

  return {
    methods,
    reset,
    handleSubmit,
    onSubmit,
    unusedFunctionaries,
    setSearchField,
  }
}
