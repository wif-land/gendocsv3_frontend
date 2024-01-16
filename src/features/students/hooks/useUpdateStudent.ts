import { VALIDATION_MESSAGES } from '../../../shared/utils/Messages'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { StudentsApi } from '../api/students'
import { toast } from 'react-toastify'
import { useStudentStore } from '../../../shared/store/studentStore'
import { IStudent } from '../types/IStudent'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'
import { useState } from 'react'

interface IStudentForm {
  dni: string | undefined
  firstName: string | undefined
  secondName: string | undefined
  firstLastName: string | undefined
  secondLastName: string | undefined
  gender: string | undefined
  birthdate: Date | undefined
  canton: string | undefined
  personalEmail: string | undefined
  outlookEmail: string | undefined
  regularPhoneNumber: string | undefined
  phoneNumber: string | undefined
  folio: string | undefined
  registration: string | undefined
  approvedCredits: number | undefined
  careerId: number | undefined
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
export const useUpdateStudent = () => {
  const { get } = useStudentStore()
  const [studentId, setStudentId] = useState(0)

  const onSubmit = async (form: IStudentForm) => {
    const { status } = await StudentsApi.updateStudent(
      studentId,
      form as unknown as IStudent,
    )

    if (status === HTTP_STATUS_CODES.OK) {
      toast.success('Estudiante actualizado con éxito!', { autoClose: 1800 })
      get()
    } else {
      toast.error(
        'Error al actualizar el estudiante, por favor intenta de nuevo.',
        {
          autoClose: 1800,
        },
      )
    }
  }

  const formik = useFormik<IStudentForm>({
    initialValues: {
      dni: undefined,
      firstName: undefined,
      secondName: undefined,
      firstLastName: undefined,
      secondLastName: undefined,
      gender: undefined,
      birthdate: undefined,
      canton: undefined,
      personalEmail: undefined,
      outlookEmail: undefined,
      regularPhoneNumber: undefined,
      phoneNumber: undefined,
      folio: undefined,
      registration: undefined,
      approvedCredits: undefined,
      careerId: undefined,
    },
    validationSchema,
    onSubmit,
  })

  return { formik, studentId, setStudentId }
}
