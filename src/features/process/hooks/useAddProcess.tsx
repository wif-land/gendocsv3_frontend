import { useFormik } from 'formik'
import * as yup from 'yup'
import { IProcess } from '../types/IProcess'
import { ProcessApi } from '../api/processes'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'
import { useProcessesStore } from '../../../shared/store/processStore'
import { toast } from 'react-toastify'

interface IProcessForm {
  name: ''
  moduleId: ''
  userId: ''
  isActive: boolean
}

const validationSchema = yup.object().shape({
  //   firstName: yup.string().required(VALIDATION_MESSAGES.required),
})

export const useAddProcess = () => {
  const { processes, setProcesses } = useProcessesStore()

  const onSubmit = async (form: IProcessForm) => {
    console.log(form)

    const { status, process } = await ProcessApi.createProcess(
      form as unknown as IProcess,
    )

    if (status === HTTP_STATUS_CODES.CREATED) {
      setProcesses([...(processes || []), process as IProcess])
      toast.success('Usuario creado con éxito!', { autoClose: 1800 })
    } else {
      toast.error('Error al crear el usuario, por favor intenta de nuevo.', {
        autoClose: 1800,
      })
    }
    console.log(process)
  }

  const formik = useFormik<IProcessForm>({
    initialValues: {
      name: '',
      moduleId: '',
      userId: '',
      isActive: false,
    },
    onSubmit,
    validationSchema,
  })

  return { formik }
}
