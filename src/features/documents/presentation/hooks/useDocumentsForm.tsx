import * as yup from 'yup'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { useDocumentStore } from '../store/documentsStore'
import { IDocument } from '../../domain/entities/IDocument'
import { DocumentsUseCasesImpl } from '../../domain/usecases/DocumentServices'
import { DocumentModel } from '../../data/models/DocumentsModel'

export const useDocumentsForm = (
  initialValues: IDocument,
  onClose: () => void,
) => {
  const { documents, setDocuments } = useDocumentStore()

  const validationSchema = yup.object({
    // name: yup.string().required('El nombre es requerido'),
  })
  const formik = useFormik<IDocument>({
    enableReinitialize: true,
    initialValues: {
      number: initialValues.number || 0,
      councilId: initialValues.councilId || 0,
      templateId: initialValues.templateId || 0,
      studentId: initialValues.studentId || 0,
      functionariesIds: initialValues.functionariesIds || [],
      userId: initialValues.userId || 0,
      description: initialValues.description || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!initialValues.id) {
        await handleCreateDocument(values)
        onClose()
        return
      }

      const editedFields: { [key: string]: unknown } = {}

      Object.keys(initialValues).forEach((key) => {
        if (
          initialValues[key as keyof IDocument] !==
          values[key as keyof IDocument]
        ) {
          editedFields[key] = values[key as keyof IDocument]
        }
      })

      if (Object.keys(editedFields).length === 0) {
        onClose()
        return
      }
      await handleUpdateDocument(initialValues.id, editedFields)
      onClose()
    },
  })

  const handleCreateDocument = async (values: IDocument) => {
    try {
      const result = await DocumentsUseCasesImpl.getInstance().create(values)
      if (result.document) {
        setDocuments([...documents, result.document])
        toast.success('Documento creado exitosamente')
        formik.resetForm()
      } else {
        toast.error('Error al crear el documento', {
          closeButton: false,
        })
      }
    } catch (error) {
      toast.error('Ocurrió un error al crear el documento')
    }
  }

  const handleUpdateDocument = async (
    id: number,
    editedFields: Partial<IDocument>,
  ) => {
    try {
      const { status } = await DocumentsUseCasesImpl.getInstance().update(
        id,
        editedFields,
      )

      if (status === HTTP_STATUS_CODES.OK) {
        setDocuments(
          documents!.map((process) =>
            process.id === id
              ? new DocumentModel({
                  ...process,
                  ...editedFields,
                })
              : process,
          ),
        )
        toast.success('Documento actualizado exitosamente')
        formik.resetForm()
      } else {
        toast.error('Error al actualizar el documento', {
          closeButton: false,
        })
      }
    } catch (error) {
      toast.error('Ocurrió un error al actualizar el documento')
    }
  }

  return { formik, processes: documents, setProcesses: setDocuments }
}
