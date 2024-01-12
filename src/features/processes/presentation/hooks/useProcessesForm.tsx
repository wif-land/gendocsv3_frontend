import * as yup from 'yup'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { useProcessStore } from '../store/processesStore'
import { IProcess } from '../../domain/entities/IProcess'
import { ProcessesUseCasesImpl } from '../../domain/usecases/ProcessServices'
import { ProcessModel } from '../../data/models/ProcessesModel'

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
      const result = await ProcessesUseCasesImpl.getInstance().create(values)

      if (result.process) {
        setProcesses([...processes, result.process])
        toast.success('Proceso creado exitosamente')
        formik.resetForm()
      } else {
        toast.error('Error al crear el proceso', {
          closeButton: false,
        })
      }
    } catch (error) {
      toast.error('Ocurrió un error al crear el proceso')
    }
  }

  const handleUpdateProcess = async (
    id: number,
    editedFields: Partial<IProcess>,
  ) => {
    try {
      const { status } = await ProcessesUseCasesImpl.getInstance().update(
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
        toast.success('Proceso actualizado exitosamente')
        formik.resetForm()
      } else {
        toast.error('Error al actualizar el proceso', {
          closeButton: false,
        })
      }
    } catch (error) {
      toast.error('Ocurrió un error al actualizar el proceso')
    }
  }

  return { formik, processes, setProcesses }
}
