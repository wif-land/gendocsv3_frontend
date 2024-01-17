import { VALIDATION_MESSAGES } from '../../../shared/utils/Messages'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { StudentsApi } from '../api/students'
import { toast } from 'react-toastify'
import { useStudentStore } from '../../../shared/store/studentStore'
import { IStudent } from '../types/IStudent'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'

interface IStudentForm {
  dni: string
  firstName: string
  secondName: string
  firstLastName: string
  secondLastName: string
  gender: string
  birthdate: Date
  canton: string
  personalEmail: string
  outlookEmail: string
  regularPhoneNumber: string
  phoneNumber: string
  folio: string
  registration: string
  approvedCredits: number
  careerId: number
}

const validationSchema = yup.object().shape({
  // dni: yup
  //   .string()
  //   .required(VALIDATION_MESSAGES.required)
  //   .matches(/^[^\s]*$/, VALIDATION_MESSAGES.invalidFormat),
  // firstName: yup
  //   .string()
  //   .required(VALIDATION_MESSAGES.required)
  //   .matches(/^[^\s]*$/, VALIDATION_MESSAGES.invalidFormat),
  // secondName: yup
  //   .string()
  //   .required(VALIDATION_MESSAGES.required)
  //   .matches(/^[^\s]*$/, VALIDATION_MESSAGES.invalidFormat),
  // firstLastName: yup
  //   .string()
  //   .required(VALIDATION_MESSAGES.required)
  //   .matches(/^[^\s]*$/, VALIDATION_MESSAGES.invalidFormat),
  // secondLastName: yup
  //   .string()
  //   .required(VALIDATION_MESSAGES.required)
  //   .matches(/^[^\s]*$/, VALIDATION_MESSAGES.invalidFormat),
  // gender: yup.string().required(VALIDATION_MESSAGES.required),
  // birthDate: yup.date().required(VALIDATION_MESSAGES.required),
  // canton: yup.string().required(VALIDATION_MESSAGES.required),
  // googleEmail: yup
  //   .string()
  //   .required(VALIDATION_MESSAGES.required)
  //   .matches(
  //     /^[A-Z0-9._%+-]+@gmail\.com$/i,
  //     VALIDATION_MESSAGES.invalidFormat,
  //   ),
  // outlookEmail: yup
  //   .string()
  //   .required(VALIDATION_MESSAGES.required)
  //   .matches(
  //     /^[A-Z0-9._%+-]+@uta\.edu\.ec$/i,
  //     VALIDATION_MESSAGES.invalidFormat,
  //   ),
  // regularPhoneNumber: yup
  //   .string()
  //   .required(VALIDATION_MESSAGES.required)
  //   .matches(/^0\d{9}$/, VALIDATION_MESSAGES.invalidFormat),
  // phoneNumber: yup
  //   .string()
  //   .required(VALIDATION_MESSAGES.required)
  //   .matches(/^0\d{9}$/, VALIDATION_MESSAGES.invalidFormat),
  // cellphone: yup
  //   .string()
  //   .required(VALIDATION_MESSAGES.required)
  //   .matches(/^0\d{9}$/, VALIDATION_MESSAGES.invalidFormat),
  // registration: yup.string().required(VALIDATION_MESSAGES.required),
  // approvedCredits: yup.number().required(VALIDATION_MESSAGES.required),
  // folio: yup.string().required(VALIDATION_MESSAGES.required),
  // careerId: yup.number().required(VALIDATION_MESSAGES.required),
})
export const useStudent = () => {
  const { setStudents, students } = useStudentStore()
  const onSubmit = async (form: IStudentForm) => {
    const { status, student } = await StudentsApi.createStudent(
      form as unknown as IStudent,
    )

    if (status === HTTP_STATUS_CODES.CREATED) {
      setStudents([...(students || []), student as IStudent])
      toast.success('Estudiante creado con éxito!', { autoClose: 1800 })
    } else {
      toast.error('Error al crear estudiante!', { autoClose: 1800 })
    }
  }

  const formik = useFormik<IStudentForm>({
    initialValues: {
      dni: '',
      firstName: '',
      secondName: '',
      firstLastName: '',
      secondLastName: '',
      gender: '',
      birthdate: new Date(),
      canton: '',
      personalEmail: '',
      outlookEmail: '',
      regularPhoneNumber: '',
      phoneNumber: '',
      folio: '',
      registration: '',
      approvedCredits: 0,
      careerId: 0,
    },
    validationSchema,
    onSubmit,
  })

  return { formik }
}
