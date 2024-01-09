import { useFormik } from 'formik'
import * as yup from 'yup'
import { FunctionariesApi } from '../api/functionaries'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'
import { useFunctionaryStore } from '@/shared/store/functionaryStore'

interface IFunctionaryForm {
  dni?: string
  firstName?: string
  secondName?: string
  firstLastName?: string
  secondLastName?: string
  outlookEmail?: string
  googleEmail?: string
  phoneNumber?: string
  regularPhoneNumber?: string
  secondLevelDegree?: string
  thirdLevelDegree?: string
  fourthLevelDegree?: string
  isActive?: boolean
}

const validationSchema = yup.object().shape({
  // dni: yup
  //   .string()
  //   .required(VALIDATION_MESSAGES.required)
  //   .matches(/^[^\s]*$/, VALIDATION_MESSAGES.noSpaces),
  // firstName: yup
  //   .string()
  //   .required(VALIDATION_MESSAGES.required)
  //   .matches(/^[^\s]*$/, VALIDATION_MESSAGES.noSpaces),
  // secondName: yup
  //   .string()
  //   .required(VALIDATION_MESSAGES.required)
  //   .matches(/^[^\s]*$/, VALIDATION_MESSAGES.noSpaces),
  // firstLastName: yup
  //   .string()
  //   .required(VALIDATION_MESSAGES.required)
  //   .matches(/^[^\s]*$/, VALIDATION_MESSAGES.noSpaces),
  // secondLastName: yup
  //   .string()
  //   .required(VALIDATION_MESSAGES.required)
  //   .matches(/^[^\s]*$/, VALIDATION_MESSAGES.noSpaces),
  // outlookEmail: yup
  //   .string()
  //   .required(VALIDATION_MESSAGES.required)
  //   .matches(
  //     /^[A-Z0-9._%+-]+@outlook\.[A-Z]{2,4}$/i,
  //     VALIDATION_MESSAGES.invalidFormat,
  //   ),
  // googleEmail: yup
  //   .string()
  //   .required(VALIDATION_MESSAGES.required)
  //   .matches(
  //     /^[A-Z0-9._%+-]+@gmail\.com$/i,
  //     VALIDATION_MESSAGES.invalidFormat,
  //   ),
  // phoneNumber: yup.string().required(VALIDATION_MESSAGES.required),
  // regularPhoneNumber: yup.string().required(VALIDATION_MESSAGES.required),
  // secondLevelDegree: yup.string().required(VALIDATION_MESSAGES.required),
  // thirdLevelDegree: yup.string().required(VALIDATION_MESSAGES.required),
  // forthLevelDegree: yup.string().required(VALIDATION_MESSAGES.required),
})

export const useUpdateFunctionary = () => {
  const { get } = useFunctionaryStore()
  const [functionaryId, setFunctionaryId] = useState('')

  const onSubmit = async (form: IFunctionaryForm) => {
    const { status } = await FunctionariesApi.updateFunctionary(
      functionaryId,
      form,
    )

    if (status === HTTP_STATUS_CODES.OK) {
      toast.success('Funcionario editado con éxito!', { autoClose: 1800 })
      get()
    } else {
      toast.error(
        'Error al editar el funcionario, por favor intenta de nuevo.',
        {
          autoClose: 1800,
        },
      )
    }
  }

  const formik = useFormik<IFunctionaryForm>({
    initialValues: {
      dni: undefined,
      firstName: undefined,
      secondName: undefined,
      firstLastName: undefined,
      secondLastName: undefined,
      outlookEmail: undefined,
      googleEmail: undefined,
      phoneNumber: undefined,
      regularPhoneNumber: undefined,
      secondLevelDegree: undefined,
      thirdLevelDegree: undefined,
      fourthLevelDegree: undefined,
      isActive: true,
    },
    validationSchema,
    onSubmit,
  })

  return { formik, functionaryId, setFunctionaryId }
}
