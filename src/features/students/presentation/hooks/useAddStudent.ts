import { useFormik } from 'formik'
import { useStudentStore } from '../../../../shared/store/studentStore'
import { IStudent } from '../../types/IStudent'
import { StudentsApi } from '../../api/students'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { enqueueSnackbar } from 'notistack'
import { NewStudentSchema } from '../constants'

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

export const useStudent = () => {
  const { setStudents, students } = useStudentStore()
  const onSubmit = async (form: IStudentForm) => {
    const { status, student } = await StudentsApi.createStudent(
      form as unknown as IStudent,
    )

    if (status === HTTP_STATUS_CODES.CREATED) {
      setStudents([...(students || []), student as IStudent])
      enqueueSnackbar('Estudiante creado con éxito!')
    } else {
      enqueueSnackbar('Error al crear estudiante!', { variant: 'error' })
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
    validationSchema: NewStudentSchema,
    onSubmit,
  })

  return { formik }
}
