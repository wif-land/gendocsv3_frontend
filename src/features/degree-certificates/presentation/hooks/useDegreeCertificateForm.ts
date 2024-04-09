import { useCallback, useEffect, useMemo, useState } from 'react'
import { DegreeCertificateModel } from '../../data/model'
import { useDegreeCertificatesStore } from '../store/degreeCertificatesStore'
import { useForm } from 'react-hook-form'
import { NewDegreeCertificateSchema, resolveDefaultValues } from '../constants'
import { getEditedFields } from '../../../../shared/utils/FormUtil'
import { usePathname, useRouter } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { useDegreeCertificateMethods } from './useDegreeCertificateMethods'
import { useDebounce } from '../../../../shared/hooks/use-debounce'
import { DegreeCertificatesCrudServices } from '../../domain/usecases/DegreeCertificatesCrud'
import { yupResolver } from '@hookform/resolvers/yup'

export const useDegreeCertificateForm = (
  currentDegreeCertificate?: DegreeCertificateModel,
) => {
  const router = useRouter()
  const pathname = usePathname()
  const { degreeCertificates } = useDegreeCertificatesStore()
  const { handleCreateDegreeCertificate, handleUpdateDegreeCertificate } =
    useDegreeCertificateMethods()
  const loading = useBoolean()

  const defaultValues: Partial<DegreeCertificateModel> = useMemo(
    () => resolveDefaultValues(currentDegreeCertificate),
    [DegreeCertificateModel],
  )
  const methods = useForm<DegreeCertificateModel>({
    // @ts-expect-error - The resolver is not being recognized
    resolver: yupResolver(NewDegreeCertificateSchema),
    defaultValues,
  })

  const [searchField, setSearchField] = useState('')
  const searchDebounced = useDebounce(searchField)

  const onSubmit = useCallback(
    async (data: DegreeCertificateModel) => {
      try {
        if (!currentDegreeCertificate) {
          await handleCreateDegreeCertificate(data)
        } else {
          const editedFields = getEditedFields<Partial<DegreeCertificateModel>>(
            defaultValues,
            data,
          )

          if (editedFields) {
            await handleUpdateDegreeCertificate(
              currentDegreeCertificate.id as number,
              editedFields,
            )
          }
        }

        router.push(
          currentDegreeCertificate
            ? pathname.replace(
                new RegExp(`/${currentDegreeCertificate.id}/edit`),
                '',
              )
            : pathname.replace('/new', ''),
        )
        enqueueSnackbar(
          !currentDegreeCertificate
            ? 'Consejo creado correctamente'
            : 'Consejo actualizado correctamente',
          { variant: 'success' },
        )
      } catch (error) {
        enqueueSnackbar(
          !currentDegreeCertificate
            ? 'Error al crear el consejo'
            : 'Error al actualizar el consejo',
          { variant: 'error' },
        )
      } finally {
        methods.reset()
      }
    },
    [currentDegreeCertificate, enqueueSnackbar, methods.reset, router],
  )

  useEffect(() => {
    let isMounted = true
    loading.onTrue()

    DegreeCertificatesCrudServices.getInstance()
      .findDegreeCertificates()
      .then((_) => {
        if (!isMounted) return

        loading.onFalse()
      })

    return () => {
      isMounted = false
    }
  }, [searchDebounced])

  return {
    degreeCertificates,
    methods,
    defaultValues,
    onSubmit,
    setSearchField,
    loading,
  }
}
