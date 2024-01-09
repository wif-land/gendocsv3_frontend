import { useFormik } from 'formik'
import * as yup from 'yup'
import { IProcess } from '../types/IProcess'
import { ProcessApi } from '../api/processes'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'
import { useProcessesStore } from '../../../shared/store/processStore'
import { toast } from 'react-toastify'
import { useState } from 'react'

interface IProcessForm {
  name: string | undefined
  moduleId: ''
  userId: ''
  isActive: boolean
}

const validationSchema = yup.object().shape({
  //   firstName: yup.string().required(VALIDATION_MESSAGES.required),
})

export const useEditProcess = () => {
  const { get } = useProcessesStore()
  const [processId, setProcessId] = useState<number>()

  const onSubmit = async (form: IProcessForm) => {
    const { status } = await ProcessApi.updateProcess(
      processId as number,
      form as unknown as IProcess,
    )

    if (status === HTTP_STATUS_CODES.OK) {
      get()
      toast.success('Proceso actualizado con éxito!', { autoClose: 1800 })
    } else {
      toast.error('Error al editar el proceso, por favor intenta de nuevo.', {
        autoClose: 1800,
      })
    }
  }

  const formik = useFormik<IProcessForm>({
    initialValues: {
      name: undefined,
      moduleId: '',
      userId: '',
      isActive: false,
    },
    onSubmit,
    validationSchema,
  })

  return { formik, setProcessId }
}
