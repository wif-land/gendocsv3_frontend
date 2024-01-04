import { useFormik } from 'formik'
import { VALIDATION_MESSAGES } from '../../../shared/utils/Messages'
import * as yup from 'yup'
import { UsersApi } from '../api/users'
import { toast } from 'react-toastify'

interface IUserForm {
  firstName: ''
  secondName: ''
  firstLastName: ''
  secondLastName: ''
  outlookEmail: ''
  googleEmail: ''
  roles: []
  isActive: false
  password: ''
  accessModules: number[]
}

export const useAddUser = () => {
  const validationSchema = yup.object().shape({
    firstName: yup.string().required(VALIDATION_MESSAGES.required),
    secondName: yup.string().required(VALIDATION_MESSAGES.required),
    firstLastName: yup.string().required(VALIDATION_MESSAGES.required),
    secondLastName: yup.string().required(VALIDATION_MESSAGES.required),
    outlookEmail: yup.string().required(VALIDATION_MESSAGES.required),
    googleEmail: yup.string().required(VALIDATION_MESSAGES.required),
    roles: yup.array().required(VALIDATION_MESSAGES.required),
    isActive: yup.boolean().required(VALIDATION_MESSAGES.required),
    password: yup.string().required(VALIDATION_MESSAGES.required),
    accessModules: yup.number().required(VALIDATION_MESSAGES.required),
  })

  const onSubmit = async (form: IUserForm) => {
    console.log(form)
    const { status } = await UsersApi.createUser(form)

    if (status === 201) {
      toast.success('Usuario creado con éxito!', { autoClose: 1800 })
    } else {
      toast.error('Error al crear el usuario, por favor intenta de nuevo.', {
        autoClose: 1800,
      })
    }
  }

  const formik = useFormik<IUserForm>({
    initialValues: {
      firstName: '',
      secondName: '',
      firstLastName: '',
      secondLastName: '',
      outlookEmail: '',
      googleEmail: '',
      roles: [],
      isActive: false,
      password: '',
      accessModules: [],
    },
    onSubmit,
    validationSchema,
  })

  return { formik }
}
