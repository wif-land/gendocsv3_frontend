import * as yup from 'yup'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { useProcessStore } from '../store/processesStore'
import { IProcess } from '../../domain/entities/ITemplate'
import { TemplatesUseCasesImpl } from '../../domain/usecases/TemplateServices'
import { ProcessModel } from '../../data/models/TemplatesModel'

export const useProcessesForm = (
  initialValues: IProcess,
  onClose: () => void,
) => {
  const { processes, setProcesses } = useProcessStore()

  const validationSchema = yup.object({
    name: yup.string().required('El nombre es requerido'),
  })

  const formik = useFormik<IProcess>({
    enableReinitialize: true,
    initialValues: {
      name: initialValues.name || '',
      isActive: initialValues.isActive || false,
      moduleId: initialValues.moduleId || 0,
      userId: initialValues.userId || 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!initialValues.id) {
        await handleCreateProcess(values)
        onClose()
        return
      }

      const editedFields: { [key: string]: unknown } = {}

      Object.keys(initialValues).forEach((key) => {
        if (
          initialValues[key as keyof IProcess] !== values[key as keyof IProcess]
        ) {
          editedFields[key] = values[key as keyof IProcess]
        }
      })

      if (Object.keys(editedFields).length === 0) {
        onClose()
        return
      }
      await handleUpdateProcess(initialValues.id, editedFields)
      onClose()
    },
  })

  const handleCreateProcess = async (values: IProcess) => {
    try {
      const result = await TemplatesUseCasesImpl.getInstance().create(values)

      if (result.process) {
        setProcesses([...processes, result.process])
        toast.success('Consejo creado exitosamente')
        formik.resetForm()
      } else {
        toast.error('Error al crear el consejo', {
          closeButton: false,
        })
      }
    } catch (error) {
      toast.error('Ocurrió un error al crear el consejo')
    }
  }

  const handleUpdateProcess = async (
    id: number,
    editedFields: Partial<IProcess>,
  ) => {
    try {
      const { status } = await TemplatesUseCasesImpl.getInstance().update(
        id,
        editedFields,
      )

      if (status === HTTP_STATUS_CODES.OK) {
        setProcesses(
          processes!.map((process) =>
            process.id === id
              ? new ProcessModel({
                  ...process,
                  ...editedFields,
                })
              : process,
          ),
        )
        toast.success('Consejo actualizado exitosamente')
        formik.resetForm()
      } else {
        toast.error('Error al actualizar el consejo', {
          closeButton: false,
        })
      }
    } catch (error) {
      toast.error('Ocurrió un error al actualizar el consejo')
    }
  }

  return { formik, processes, setProcesses }
}
