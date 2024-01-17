import { useFormik } from 'formik'
import { VALIDATION_MESSAGES } from '../../../shared/utils/Messages'
import * as yup from 'yup'
import { UsersApi } from '../api/users'
import { toast } from 'react-toastify'
import { useUsersStore } from '../../../shared/store/usersStore'
import { IUser } from '../../../features/auth/types/IUser'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'

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

const validationSchema = yup.object().shape({
  firstName: yup.string().required(VALIDATION_MESSAGES.required),
  secondName: yup.string().required(VALIDATION_MESSAGES.required),
  firstLastName: yup.string().required(VALIDATION_MESSAGES.required),
  secondLastName: yup.string().required(VALIDATION_MESSAGES.required),
  outlookEmail: yup.string().required(VALIDATION_MESSAGES.required).matches(
    /^[A-Z0-9._%+-]+@uta\.edu\.ec$/i,
    VALIDATION_MESSAGES.invalidFormat,
  ),
  googleEmail: yup.string().required(VALIDATION_MESSAGES.required).matches(
    /^[A-Z0-9._%+-]+@gmail\.com$/i,
    VALIDATION_MESSAGES.invalidFormat,
  ),
  roles: yup.array().required(VALIDATION_MESSAGES.required),
  isActive: yup.boolean().required(VALIDATION_MESSAGES.required),
  password: yup.string().required(VALIDATION_MESSAGES.required),
  accessModules: yup.number().required(VALIDATION_MESSAGES.required),
})

export const useAddUser = () => {
  const { setUsers, users } = useUsersStore()
  const onSubmit = async (form: IUserForm) => {
    console.log(form)
    const { status, user } = await UsersApi.createUser(form)

    console.log(user)

    if (status === HTTP_STATUS_CODES.CREATED) {
      setUsers([...(users || []), user as IUser])
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
