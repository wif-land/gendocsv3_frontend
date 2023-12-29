import { useFormik } from 'formik'
import { login } from '../api/auth'
import { VALIDATION_MESSAGES } from '../utils/Messages'
import * as yup from 'yup'
import { setCookie } from '../../../shared/utils/CookiesUtil'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

interface IAuth {
  email: string
  password: string
}

export const useAuth = () => {
  const router = useRouter()
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
    const { status, message, decoded } = await login(form.email, form.password)

    if (status === 'ok') {
      setCookie('user', decoded)
      toast.success(`Bienvenido de vuelta ${decoded?.username}!`, {
        autoClose: 1800,
      })
      router.push('/dashboard')
    } else {
      toast.error(message, { autoClose: 1800 })
    }
  }

  const logout = () => {
    setCookie('user', null)
    toast.success('Hasta pronto!', { autoClose: 1800 })
    router.push('/')
  }

  const formik = useFormik<IAuth>({
    initialValues: { email: '', password: '' },
    onSubmit,
    validationSchema,
  })

  return { formik, logout }
}
