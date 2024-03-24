import { toast } from 'react-toastify'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { useDocumentStore } from '../store/documentsStore'
import { IDocument } from '../../domain/entities/IDocument'
import { DocumentsUseCasesImpl } from '../../domain/usecases/DocumentServices'
import { DocumentModel } from '../../data/models/DocumentsModel'
import { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { NewDocumentSchema, resolveDefaultValues } from '../constants/constants'
import { usePathname, useRouter } from 'next/navigation'
import { yupResolver } from '@hookform/resolvers/yup'
import { getEditedFields } from '../../../../shared/utils/FormUtil'
import { enqueueSnackbar } from 'notistack'

export const useDocumentsForm = (currentDocument?: DocumentModel) => {
  const { documents, setDocuments } = useDocumentStore()
  const router = useRouter()
  const pathname = usePathname()

  const defaultValues: Partial<DocumentModel> = useMemo(
    () => resolveDefaultValues(currentDocument),
    [currentDocument],
  )
  const methods = useForm<DocumentModel>({
    // @ts-expect-error - The resolver is not being recognized
    resolver: yupResolver(NewDocumentSchema),
    defaultValues,
  })

  // const formik = useFormik<IDocument>({
  //   enableReinitialize: true,
  //   initialValues: {
  //     number: initialValues.number || 0,
  //     councilId: initialValues.councilId || 0,
  //     templateId: initialValues.templateId || 0,
  //     studentId: initialValues.studentId || 0,
  //     functionariesIds: initialValues.functionariesIds || [],
  //     userId: initialValues.userId || 0,
  //     description: initialValues.description || '',
  //   },
  //   validationSchema,
  //   onSubmit: async (values) => {
  //     if (!initialValues.id) {
  //       await handleCreateDocument(values)
  //       onClose()
  //       return
  //     }

  //     const editedFields: { [key: string]: unknown } = {}

  //     Object.keys(initialValues).forEach((key) => {
  //       if (
  //         initialValues[key as keyof IDocument] !==
  //         values[key as keyof IDocument]
  //       ) {
  //         editedFields[key] = values[key as keyof IDocument]
  //       }
  //     })

  //     if (Object.keys(editedFields).length === 0) {
  //       onClose()
  //       return
  //     }
  //     await handleUpdateDocument(initialValues.id, editedFields)
  //     onClose()
  //   },
  // })

  const handleCreateDocument = async (values: IDocument) => {
    try {
      const result = await DocumentsUseCasesImpl.getInstance().create(values)
      if (result.document) {
        setDocuments([...documents, result.document])
        toast.success('Documento creado exitosamente')
        methods.reset()
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
        methods.reset()
      } else {
        toast.error('Error al actualizar el documento', {
          closeButton: false,
        })
      }
    } catch (error) {
      toast.error('Ocurrió un error al actualizar el documento')
    }
  }

  const onSubmit = useCallback(
    async (data: DocumentModel) => {
      try {
        if (!currentDocument) {
          await handleCreateDocument(data)
        } else {
          const editedFields = getEditedFields<Partial<DocumentModel>>(
            defaultValues,
            data,
          )

          if (editedFields) {
            await handleUpdateDocument(
              currentDocument.id as number,
              editedFields,
            )
          }
        }

        router.push(
          currentDocument
            ? pathname.replace(new RegExp(`/${currentDocument.id}/edit`), '')
            : pathname.replace('/new', ''),
        )
        enqueueSnackbar(
          !currentDocument
            ? 'Consejo creado correctamente'
            : 'Consejo actualizado correctamente',
          { variant: 'success' },
        )
      } catch (error) {
        enqueueSnackbar(
          !currentDocument
            ? 'Error al crear el consejo'
            : 'Error al actualizar el consejo',
          { variant: 'error' },
        )
      } finally {
        methods.reset()
      }
    },
    [currentDocument, enqueueSnackbar, methods.reset, router],
  )

  return {
    processes: documents,
    setProcesses: setDocuments,
    methods,
    onSubmit,
  }
}
