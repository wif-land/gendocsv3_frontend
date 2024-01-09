import { useFormik } from 'formik'
import * as yup from 'yup'

interface IProcessForm {
  processName: ''
  moduleId: ''
  userId: ''
  isActive: boolean
}

const validationSchema = yup.object().shape({
  //   firstName: yup.string().required(VALIDATION_MESSAGES.required),
})

export const useAddProcess = () => {
  const onSubmit = async (form: IProcessForm) => {
    console.log(form)

    // const { message, process } = await ProcessApi.createProcess(
    //   form as unknown as IProcess,
    // )
  }

  const formik = useFormik<IProcessForm>({
    initialValues: {
      processName: '',
      moduleId: '',
      userId: '',
      isActive: false,
    },
    onSubmit,
    validationSchema,
  })

  return { formik }
}
