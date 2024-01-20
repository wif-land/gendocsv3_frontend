import { useCallback, useEffect, useMemo } from 'react'
import { ICareer } from '../../domain/entities/ICareer'
import { useFunctionaryStore } from '../../../../shared/store/functionaryStore'
import { usePathname, useRouter } from 'next/navigation'
import * as Yup from 'yup'
import { useSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { CareersUseCasesImpl } from '../../domain/usecases/CareerServices'
import { useCareersStore } from '../state/careerStore'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'

interface FormValuesProps extends ICareer {}

export const useCareerForm = (currentCareer?: ICareer) => {
  const router = useRouter()
  const pathname = usePathname()
  const { functionaries, get } = useFunctionaryStore()
  const { enqueueSnackbar } = useSnackbar()
  const { addCareer, updateCareer } = useCareersStore()

  const NewCareerSchema = Yup.object().shape({
    name: Yup.string().required('Campo requerido'),
    credits: Yup.number().required('Campo requerido').max(140).min(130),
    coordinator: Yup.string().required('Campo requerido'),
    menDegree: Yup.string().required('Campo requerido'),
    womenDegree: Yup.string().required('Campo requerido'),
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
      isActive: currentCareer?.isActive || true,
    }),
    [currentCareer],
  )

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewCareerSchema),
    defaultValues,
  })

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const handleCreate = useCallback(async (values: ICareer) => {
    const result = await CareersUseCasesImpl.getInstance().create(values)

    console.log({ result })

    if (result.career) {
      addCareer(result.career)
      enqueueSnackbar('Carrera creada exitosamente')
    } else {
      throw new Error('Error al crear el consejo')
    }
  }, [])

  const handleUpdate = async (id: number, editedFields: Partial<ICareer>) => {
    const { status } = await CareersUseCasesImpl.getInstance().update(
      id,
      editedFields,
    )

    if (status === HTTP_STATUS_CODES.OK) {
      updateCareer(editedFields)
      enqueueSnackbar('Consejo actualizado exitosamente')
    } else {
      throw new Error('Error al actualizar el consejo')
    }
  }

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        const functionaryId = functionaries?.find(
          (f) => f.dni === (data.coordinator as string).split('-')[1].trim(),
        )?.id

        if (!currentCareer) {
          await handleCreate({
            ...data,
            coordinator: functionaryId as number,
          })
        } else {
          await handleUpdate(currentCareer.id as number, {
            ...data,
            coordinator: functionaryId as number,
          })
        }

        router.push(
          currentCareer
            ? pathname.replace(new RegExp(`/${currentCareer.id}/edit`), '')
            : pathname.replace('/new', ''),
        )
        reset()
      } catch (error) {
        enqueueSnackbar('Error al crear la carrera', {
          variant: 'error',
        })
      }
    },
    [currentCareer, enqueueSnackbar, reset, router],
  )

  useEffect(() => {
    if (currentCareer) {
      reset(defaultValues)
    }
  }, [reset, currentCareer, defaultValues])

  useEffect(() => {
    if (!functionaries) {
      get()
    }
  }, [])

  return {
    functionaries,
    isSubmitting,
    methods,
    onSubmit,
    handleSubmit,
  }
}
