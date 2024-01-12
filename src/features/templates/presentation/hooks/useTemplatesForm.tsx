import * as yup from 'yup'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { useProcessStore } from '../../../processes/presentation/store/processesStore'
import { ITemplate } from '../../domain/entities/ITemplate'
import { TemplatesUseCasesImpl } from '../../domain/usecases/TemplateServices'

export const useTemplatesForm = (
  initialValues: ITemplate,
  onClose: () => void,
) => {
  const { addTemplateToProcess, updateTemplate } = useProcessStore()

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
      await handleUpdateTemplate(initialValues, editedFields)
      onClose()
    },
  })

  const handleCreateTemplate = async (values: ITemplate) => {
    try {
      const result = await TemplatesUseCasesImpl.getInstance().create(values)

      if (result.template) {
        addTemplateToProcess(result.template, values.processId as number)
        toast.success('Plantilla creado exitosamente')
        formik.resetForm()
      } else {
        toast.error('Error al crear el plantilla', {
          closeButton: false,
        })
      }
    } catch (error) {
      toast.error('Ocurrió un error al crear el plantilla')
    }
  }

  const handleUpdateTemplate = async (
    initialValues: ITemplate,
    editedFields: Partial<ITemplate>,
  ) => {
    try {
      const { status } = await TemplatesUseCasesImpl.getInstance().update(
        initialValues.id as number,
        editedFields,
      )

      if (status === HTTP_STATUS_CODES.OK) {
        updateTemplate(
          initialValues.processId as number,
          initialValues.id as number,
          editedFields,
        )
        toast.success('Planitlla actualizado exitosamente')
        formik.resetForm()
      } else {
        toast.error('Error al actualizar el plantilla', {
          closeButton: false,
        })
      }
    } catch (error) {
      toast.error('Ocurrió un error al actualizar el plantilla')
    }
  }

  return { formik }
}
