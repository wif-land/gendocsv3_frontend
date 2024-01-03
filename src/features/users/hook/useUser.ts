import { useFormik } from 'formik'
import { VALIDATION_MESSAGES } from '../../../shared/utils/Messages'
import * as yup from 'yup'
// import { toast } from 'react-toastify'
import { ICreateUser } from '../../auth/types/IUser'

export const useUser = () => {
  const validationSchema = yup.object().shape({
    firstName: yup.string().required(VALIDATION_MESSAGES.required),
    secondName: yup.string().required(VALIDATION_MESSAGES.required),
    firstLastName: yup.string().required(VALIDATION_MESSAGES.required),
    secondLastName: yup.string().required(VALIDATION_MESSAGES.required),
    outlookEmail: yup.string().required(VALIDATION_MESSAGES.required),
    googleEmail: yup.string().required(VALIDATION_MESSAGES.required),
    roles: yup.array().required(VALIDATION_MESSAGES.required),
    platformPermission: yup.string().required(VALIDATION_MESSAGES.required),
    isActive: yup.boolean().required(VALIDATION_MESSAGES.required),
    accessModules: yup.array().required(VALIDATION_MESSAGES.required),
  })

  const onSubmit = (form: ICreateUser) => {
    // TODO - implementar fetch api
    console.log('form', form)
  }

  const formik = useFormik<ICreateUser>({
    initialValues: {
      firstName: '',
      secondName: '',
      firstLastName: '',
      secondLastName: '',
      outlookEmail: '',
      googleEmail: '',
      roles: [],
      platformPermission: null,
      isActive: false,
      accessModules: [],
    },
    onSubmit,
    validationSchema,
  })

  return { formik }
}
