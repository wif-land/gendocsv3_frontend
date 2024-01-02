import { VALIDATION_MESSAGES } from '../../../shared/utils/Messages'
import { useFormik } from 'formik'
import * as yup from 'yup'

interface IStudentForm {
  dni: string
  firstName: string
  secondName: string
  firstLastName: string
  secondLastName: string
  gender: string
  birthDate: Date
  residenceCity: string
  personalEmail: string
  institutionalEmail: string
  regularPhoneNumber: string
  cellphone: string
  folio: string
}

export const useStudent = () => {
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
    gender: yup.string().required(VALIDATION_MESSAGES.required),
    birthDate: yup.date().required(VALIDATION_MESSAGES.required),
    residenceCity: yup.string().required(VALIDATION_MESSAGES.required),
    personalEmail: yup
      .string()
      .required(VALIDATION_MESSAGES.required)
      .matches(
        /^[A-Z0-9._%+-]+@gmail\.com$/i,
        VALIDATION_MESSAGES.invalidFormat,
      ),
    institutionalEmail: yup
      .string()
      .required(VALIDATION_MESSAGES.required)
      .matches(
        /^[A-Z0-9._%+-]+@uta\.edu\.ec$/i,
        VALIDATION_MESSAGES.invalidFormat,
      ),
    regularPhoneNumber: yup.string().required(VALIDATION_MESSAGES.required),
    phoneNumber: yup.string().required(VALIDATION_MESSAGES.required),
    cellphone: yup.string().required(VALIDATION_MESSAGES.required),
  })

  const onSubmit = async (form: IStudentForm) => {
    // TODO - Implemetar llamada a API
    console.log(form)
  }

  const formik = useFormik<IStudentForm>({
    initialValues: {
      dni: '',
      firstName: '',
      secondName: '',
      firstLastName: '',
      secondLastName: '',
      gender: '',
      birthDate: new Date(),
      residenceCity: '',
      personalEmail: '',
      institutionalEmail: '',
      regularPhoneNumber: '',
      cellphone: '',
      folio: '',
    },
    validationSchema,
    onSubmit,
  })

  return { formik }
}
