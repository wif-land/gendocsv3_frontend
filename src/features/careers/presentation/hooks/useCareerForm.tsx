import { useCallback, useEffect, useMemo } from 'react'
import { ICareer } from '../../domain/entities/ICareer'
import { useFunctionaryStore } from '../../../../shared/store/functionaryStore'
import { useRouter } from 'next/navigation'
import * as Yup from 'yup'
import { useSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

interface FormValuesProps extends ICareer {}

export const useCareerForm = (currentCareer?: ICareer) => {
  const router = useRouter()
  const { functionaries } = useFunctionaryStore()
  const { enqueueSnackbar } = useSnackbar()

  const NewCareerSchema = Yup.object().shape({
    name: Yup.string().required('Campo requerido'),
    credits: Yup.number().required('Campo requerido').max(140).min(130),
    menDegree: Yup.string().required('Campo requerido'),
    womenDegree: Yup.string().required('Campo requerido'),
    coordinator: Yup.string().required('Campo requerido'),
    internshipHours: Yup.number().required('Campo requerido').max(250).min(230),
    vinculationHours: Yup.number().required('Campo requerido').max(95).min(80),
  })

  const defaultValues = useMemo(
    () => ({
      name: currentCareer?.name || '',
      credits: currentCareer?.credits || 0,
      menDegree: currentCareer?.menDegree || '',
      womenDegree: currentCareer?.womenDegree || '',
      coordinator: currentCareer?.coordinator || '',
      internshipHours: currentCareer?.internshipHours || 0,
      vinculationHours: currentCareer?.vinculationHours || 0,
      isActive: currentCareer?.isActive || false,
    }),
    [currentCareer],
  )

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewCareerSchema),
    defaultValues,
  })

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const values = watch()

  console.info('VALUES', values)

  useEffect(() => {
    if (currentCareer) {
      reset(defaultValues)
    }
  }, [reset, currentCareer, defaultValues])

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
        reset()
        // enqueueSnackbar(currentCareer ? 'Update success!' : 'Create success!')
        // router.push('/careers')
        console.info('DATA', data)
      } catch (error) {
        console.error(error)
      }
    },
    [currentCareer, enqueueSnackbar, reset, router],
  )

  return {
    functionaries,
    isSubmitting,
    methods,
    onSubmit,
    handleSubmit,
  }
}
