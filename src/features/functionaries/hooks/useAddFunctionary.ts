import { VALIDATION_MESSAGES } from '../../../shared/utils/Messages'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { FunctionariesApi } from '../api/functionaries'
import { toast } from 'react-toastify'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'
import { useFunctionaryStore } from '../../../shared/store/functionaryStore'
import { IFunctionary } from '../domain/entities/IFunctionary'

interface IFunctionaryForm {
  dni: string
  firstName: string
  secondName: string
  firstLastName: string
  secondLastName: string
  outlookEmail: string
  personalEmail: string
  phoneNumber: string
  regularPhoneNumber: string
  secondLevelDegree: string
  thirdLevelDegree: string
  fourthLevelDegree: string
  isActive: boolean
}
const validationSchema = yup.object().shape({
  dni: yup.string().required(VALIDATION_MESSAGES.required),
  firstName: yup.string().required(VALIDATION_MESSAGES.required),
  secondName: yup.string().required(VALIDATION_MESSAGES.required),
  firstLastName: yup.string().required(VALIDATION_MESSAGES.required),
  secondLastName: yup.string().required(VALIDATION_MESSAGES.required),
  outlookEmail: yup
    .string()
    .required(VALIDATION_MESSAGES.required)
    .matches(
      /^[A-Z0-9._%+-]+@uta\.edu\.ec$/i,
      VALIDATION_MESSAGES.invalidFormat,
    ),
  personalEmail: yup
    .string()
    .required(VALIDATION_MESSAGES.required)
    .matches(
      /^[A-Z0-9._%+-]+@+[A-Z0-9._%+-]+\.com$/i,
      VALIDATION_MESSAGES.invalidFormat,
    ),
  phoneNumber: yup.string().required(VALIDATION_MESSAGES.required),
  regularPhoneNumber: yup.string().required(VALIDATION_MESSAGES.required),
  secondLevelDegree: yup.string().required(VALIDATION_MESSAGES.required),
  thirdLevelDegree: yup.string().required(VALIDATION_MESSAGES.required),
  fourthLevelDegree: yup.string().required(VALIDATION_MESSAGES.required),
})
export const useAddFunctionary = () => {
  const { setFunctionaries, functionaries } = useFunctionaryStore()
  const onSubmit = async (form: IFunctionaryForm) => {
    const { status, functionary } =
      await FunctionariesApi.createFunctionary(form)

    if (status === HTTP_STATUS_CODES.CREATED) {
      setFunctionaries([...(functionaries || []), functionary as IFunctionary])
      toast.success('Funcionario creado con éxito!', { autoClose: 1800 })
    } else {
      toast.error(
        'Error al crear el funcionario, por favor intenta de nuevo.',
        {
          autoClose: 1800,
        },
      )
    }
  }

  const formik = useFormik<IFunctionaryForm>({
    initialValues: {
      dni: '',
      firstName: '',
      secondName: '',
      firstLastName: '',
      secondLastName: '',
      outlookEmail: '',
      personalEmail: '',
      phoneNumber: '',
      regularPhoneNumber: '',
      secondLevelDegree: '',
      thirdLevelDegree: '',
      fourthLevelDegree: '',
      isActive: true,
    },
    validationSchema,
    onSubmit,
  })

  return { formik }
}
