import { useFormik } from 'formik'
import { login } from '../api/auth'
import { VALIDATION_MESSAGES } from '../utils/Messages'
import * as yup from 'yup'

interface IAuth {
  email: string
  password: string
}

export const useAuth = () => {
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
    console.log(form.email, form.password)
    const { status, message, data } = await login(form.email, form.password)

    if (status === 'ok') {
      console.log(data)
    } else {
      console.log(message)
    }
  }

  const formik = useFormik<IAuth>({
    initialValues: { email: '', password: '' },
    onSubmit,
    validationSchema,
  })

  return { formik }
}
