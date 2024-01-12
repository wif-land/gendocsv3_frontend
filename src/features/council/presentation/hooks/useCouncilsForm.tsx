import * as yup from 'yup'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { useCouncilStore } from '../store/councilsStore'
import { CouncilModel } from '../../data/models/CouncilModel'
import { CouncilsUseCasesImpl } from '../../domain/usecases/CouncilServices'
import { ICouncil } from '../../domain/entities/ICouncil'
import { useCallback } from 'react'

export const useCouncilsForm = (
  initialValues: ICouncil,
  onClose: () => void,
) => {
  const { councils, addCouncil, setCouncils } = useCouncilStore()

  const validationSchema = yup.object({
    name: yup.string().required('El nombre es requerido'),
    date: yup.date().required('La fecha es requerida'),
  })

  const handleCreateCouncil = useCallback(async (values: ICouncil) => {
    try {
      const result = await CouncilsUseCasesImpl.getInstance().create(values)

      if (result.council) {
        addCouncil(result.council)
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
  }, [])

  const handleUpdateCouncil = async (
    id: number,
    editedFields: Partial<ICouncil>,
  ) => {
    try {
      const { status } = await CouncilsUseCasesImpl.getInstance().update(
        id,
        editedFields,
      )

      if (status === HTTP_STATUS_CODES.OK) {
        setCouncils(
          councils!.map((council) =>
            council.id === id
              ? new CouncilModel({
                  ...council,
                  ...editedFields,
                })
              : council,
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

  const formik = useFormik<ICouncil>({
    enableReinitialize: true,
    initialValues: {
      name: initialValues.name || '',
      date: initialValues.date || null,
      type: initialValues.type || '',
      isActive: initialValues.isActive || false,
      isArchived: initialValues.isArchived || false,
      moduleId: initialValues.moduleId || 0,
      userId: initialValues.userId || 0,
    },
    validationSchema,
    onSubmit: useCallback(
      async (values) => {
        if (!initialValues.id) {
          await handleCreateCouncil(values)
          onClose()
          return
        }

        const editedFields: { [key: string]: unknown } = {}

        Object.keys(initialValues).forEach((key) => {
          if (
            initialValues[key as keyof ICouncil] !==
            values[key as keyof ICouncil]
          ) {
            editedFields[key] = values[key as keyof ICouncil]
          }
        })

        if (Object.keys(editedFields).length === 0) {
          onClose()
          return
        }

        await handleUpdateCouncil(initialValues.id, editedFields)
        onClose()
      },
      [initialValues, onClose, handleCreateCouncil, handleUpdateCouncil],
    ),
  })

  return { formik, councils, setCouncils }
}
