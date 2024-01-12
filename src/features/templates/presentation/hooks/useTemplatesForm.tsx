import * as yup from 'yup'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { useProcessStore } from '../store/processesStore'
import { ITemplate } from '../../domain/entities/ITemplate'
import { TemplatesUseCasesImpl } from '../../domain/usecases/TemplateServices'
import { TemplateModel } from '../../data/models/TemplatesModel'

export const useProcessesForm = (
  initialValues: ITemplate,
  onClose: () => void,
) => {
  const { processes, setProcesses } = useProcessStore()

  const validationSchema = yup.object({
    name: yup.string().required('El nombre es requerido'),
  })

  const formik = useFormik<ITemplate>({
    enableReinitialize: true,
    initialValues: {
      name: initialValues.name || '',
      isActive: initialValues.isActive || false,
      hasStudent: initialValues.hasStudent || false,
      hasFunctionary: initialValues.hasFunctionary || false,
      processId: initialValues.processId || 0,
      userId: initialValues.userId || 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!initialValues.id) {
        await handleCreateTemplate(values)
        onClose()
        return
      }

      const editedFields: { [key: string]: unknown } = {}

      Object.keys(initialValues).forEach((key) => {
        if (
          initialValues[key as keyof ITemplate] !==
          values[key as keyof ITemplate]
        ) {
          editedFields[key] = values[key as keyof ITemplate]
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

  const handleCreateTemplate = async (values: ITemplate) => {
    try {
      const result = await TemplatesUseCasesImpl.getInstance().create(values)
      const processToChange = processes?.find(
        (process) => process.id === values.processId,
      )

      if (result.template) {
        setProcesses([...processes, result.template])
        toast.success('Plantilla creado exitosamente')
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
    editedFields: Partial<ITemplate>,
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
              ? new TemplateModel({
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
