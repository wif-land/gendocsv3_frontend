import { useFormik } from 'formik'
import { login } from '../api/auth'
import { VALIDATION_MESSAGES } from '../../../shared/utils/Messages'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { IUser } from '../types/IUser'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'
import { useUserStore } from '../../../shared/store/userStore'
import { appPublicRoutes } from '../../../shared/constants/appPublicRoutes'

interface IAuth {
  email: string
  password: string
}

export const useAuth = () => {
  const router = useRouter()
  const { setUser, logout: userStoreLogout } = useUserStore()

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email(VALIDATION_MESSAGES.invalidFormat)
      .required(VALIDATION_MESSAGES.required)
      .matches(
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i,
        VALIDATION_MESSAGES.invalidFormat,
      ),
    password: yup.string().required(VALIDATION_MESSAGES.required),
  })

  const onSubmit = async (form: IAuth) => {
    const { status, decoded } = (await login(form.email, form.password)) as {
      status: number
      decoded?: IUser
    }

    if (status === HTTP_STATUS_CODES.CREATED) {
      decoded && setUser(decoded)
      toast.success(`Bienvenido de vuelta ${decoded!.firstName}!`, {
        autoClose: 1800,
      })
      router.push('/dashboard')
    } else {
      toast.error(
        'Error al iniciar sesión, por favor verifica tus credenciales.',
        { autoClose: 1800 },
      )
    }
  }

  const logout = async () => {
    const TIME_TO_SLEEP = 250

    new Promise((resolve) => setTimeout(resolve, TIME_TO_SLEEP))
      .then(() => {
        userStoreLogout()
        toast.success('Hasta pronto!', { autoClose: 1800 })
      })
      .then(() => {
        new Promise((resolve) => setTimeout(resolve, TIME_TO_SLEEP)).then(() =>
          router.push(appPublicRoutes.login),
        )
      })
  }

  const formik = useFormik<IAuth>({
    initialValues: { email: '', password: '' },
    onSubmit,
    validationSchema,
  })

  return { formik, logout }
}
