import { VALIDATION_MESSAGES } from '../../../shared/utils/Messages'
import { useFormik } from 'formik'
import * as yup from 'yup'

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
  forthLevelDegree: string
}

export const useAddFunctionary = () => {
  const validationSchema = yup.object().shape({
    dni: yup
      .string()
      .required(VALIDATION_MESSAGES.required)
      .matches(/^[^\s]*$/, VALIDATION_MESSAGES.noSpaces),
    firstName: yup
      .string()
      .required(VALIDATION_MESSAGES.required)
      .matches(/^[^\s]*$/, VALIDATION_MESSAGES.noSpaces),
    secondName: yup
      .string()
      .required(VALIDATION_MESSAGES.required)
      .matches(/^[^\s]*$/, VALIDATION_MESSAGES.noSpaces),
    firstLastName: yup
      .string()
      .required(VALIDATION_MESSAGES.required)
      .matches(/^[^\s]*$/, VALIDATION_MESSAGES.noSpaces),
    secondLastName: yup
      .string()
      .required(VALIDATION_MESSAGES.required)
      .matches(/^[^\s]*$/, VALIDATION_MESSAGES.noSpaces),
    outlookEmail: yup
      .string()
      .required(VALIDATION_MESSAGES.required)
      .matches(
        /^[A-Z0-9._%+-]+@outlook\.[A-Z]{2,4}$/i,
        VALIDATION_MESSAGES.invalidFormat,
      ),
    googleEmail: yup
      .string()
      .required(VALIDATION_MESSAGES.required)
      .matches(
        /^[A-Z0-9._%+-]+@gmail\.com$/i,
        VALIDATION_MESSAGES.invalidFormat,
      ),
    phoneNumber: yup.string().required(VALIDATION_MESSAGES.required),
    regularPhoneNumber: yup.string().required(VALIDATION_MESSAGES.required),
    secondLevelDegree: yup.string().required(VALIDATION_MESSAGES.required),
    thirdLevelDegree: yup.string().required(VALIDATION_MESSAGES.required),
    forthLevelDegree: yup.string().required(VALIDATION_MESSAGES.required),
  })

  const onSubmit = (form: IFunctionaryForm) => {
    console.log(form)
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
      forthLevelDegree: '',
    },
    validationSchema,
    onSubmit,
  })

  return { formik }
}
