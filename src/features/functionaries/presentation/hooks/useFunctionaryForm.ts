import { useSnackbar } from 'notistack'
import { useFunctionaryStore } from '../../../../shared/store/functionaryStore'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { IFunctionary } from '../../domain/entities/IFunctionary'
import * as Yup from 'yup'
import { useCallback, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'
import { VALIDATION_MESSAGES } from '../../../../shared/utils/Messages'

interface FormValuesProps extends IFunctionary {}

export const useFunctionaryForm = (currentFunctionary?: IFunctionary) => {
  const router = useRouter()
  const { functionaries } = useFunctionaryStore()
  const { enqueueSnackbar } = useSnackbar()
  const { loader } = useLoaderStore()

  const NewFunctionarySchema = Yup.object().shape({
    dni: Yup.string().required(VALIDATION_MESSAGES.required),
    firstName: Yup.string().required(VALIDATION_MESSAGES.required),
    secondName: Yup.string().required(VALIDATION_MESSAGES.required),
    firstLastName: Yup.string().required(VALIDATION_MESSAGES.required),
    secondLastName: Yup.string().required(VALIDATION_MESSAGES.required),
    outlookEmail: Yup.string()
      .required(VALIDATION_MESSAGES.required)
      .matches(
        /^[A-Z0-9._%+-]+@uta\.edu\.ec$/i,
        VALIDATION_MESSAGES.invalidFormat,
      ),
    personalEmail: Yup.string()
      .required(VALIDATION_MESSAGES.required)
      .matches(
        /^[A-Z0-9._%+-]+@+[A-Z0-9._%+-]+\.com$/i,
        VALIDATION_MESSAGES.invalidFormat,
      ),
    phoneNumber: Yup.string().required(VALIDATION_MESSAGES.required),
    regularPhoneNumber: Yup.string().required(VALIDATION_MESSAGES.required),
    secondLevelDegree: Yup.string().required(VALIDATION_MESSAGES.required),
    thirdLevelDegree: Yup.string().required(VALIDATION_MESSAGES.required),
    fourthLevelDegree: Yup.string().required(VALIDATION_MESSAGES.required),
  })

  const defaultValues = useMemo(
    () => ({
      dni: currentFunctionary?.dni || '',
      firstName: currentFunctionary?.firstName || '',
      secondName: currentFunctionary?.secondName || '',
      firstLastName: currentFunctionary?.firstLastName || '',
      secondLastName: currentFunctionary?.secondLastName || '',
      outlookEmail: currentFunctionary?.outlookEmail || '',
      personalEmail: currentFunctionary?.personalEmail || '',
      phoneNumber: currentFunctionary?.phoneNumber || '',
      regularPhoneNumber: currentFunctionary?.regularPhoneNumber || '',
      secondLevelDegree: currentFunctionary?.secondLevelDegree || '',
      thirdLevelDegree: currentFunctionary?.thirdLevelDegree || '',
      fourthLevelDegree: currentFunctionary?.fourthLevelDegree || '',
      isActive: currentFunctionary?.isActive || true,
    }),
    [currentFunctionary],
  )

  const methods = useForm<FormValuesProps>({
    // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
    resolver: yupResolver(NewFunctionarySchema),
    defaultValues,
  })

  const { reset, handleSubmit } = methods

  useEffect(() => {
    if (currentFunctionary) {
      reset(defaultValues)
    }
  }, [reset, currentFunctionary, defaultValues])

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        reset()
        // enqueueSnackbar(currentFunctionary ? 'Update success!' : 'Create success!')
        // router.push('/careers')
        console.info('DATA', data)
      } catch (error) {
        console.error(error)
      }
    },
    [currentFunctionary, enqueueSnackbar, reset, router],
  )

  return {
    loader,
    functionaries,
    methods,
    onSubmit,
    handleSubmit,
  }
}
