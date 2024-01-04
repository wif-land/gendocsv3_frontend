import { VALIDATION_MESSAGES } from '../../../shared/utils/Messages'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { FunctionariesApi } from '../api/functionaries'
import { toast } from 'react-toastify'

interface IFunctionaryForm {
  dni: string
  firstName: string
  secondName: string
  firstLastName: string
  secondLastName: string
  outlookEmail: string
  googleEmail: string
  phoneNumber: string
  regularPhoneNumber: string
  secondLevelDegree: string
  thirdLevelDegree: string
  fourthLevelDegree: string // Corregido de 'forth' a 'fourth'
  isActive: boolean // Agregado para reflejar el objeto JSON
}
export const useAddFunctionary = () => {
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

  const onSubmit = async (form: IFunctionaryForm) => {
    console.log(form)

    const { status } = await FunctionariesApi.createFunctionary(form)

    if (status === 201) {
      toast.success('Funcionario creado con éxito!', { autoClose: 1800 })
    } else {
      toast.error(
        'Error al crear el funcionario, por favor intenta de nuevo.',
        {
          autoClose: 1800,
        },
      )
    }
  }

  const formik = useFormik<IFunctionaryForm>({
    initialValues: {
      dni: '',
      firstName: '',
      secondName: '',
      firstLastName: '',
      secondLastName: '',
      outlookEmail: '',
      googleEmail: '',
      phoneNumber: '',
      regularPhoneNumber: '',
      secondLevelDegree: '',
      thirdLevelDegree: '',
      fourthLevelDegree: '',
      isActive: true,
    },
    validationSchema,
    onSubmit,
  })

  return { formik }
}
