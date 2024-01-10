import * as yup from 'yup'
import { toast } from 'react-toastify'

import { useFormik } from 'formik'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { useCouncilStore } from '../store/councilsStore'
import { CouncilModel } from '../../data/models/CouncilModel'
import { CouncilsUseCasesImpl } from '../../domain/usecases/CouncilServices'

export const useCouncilsForm = (values: CouncilModel, onClose: () => void) => {
  const { councils, setCouncils } = useCouncilStore()

  const validationSchema = yup.object({
    name: yup.string().required('Campo requerido'),
    credits: yup.number().required('Campo requerido'),
    menDegree: yup.string().required('Campo requerido'),
    womenDegree: yup.string().required('Campo requerido'),
    coordinator: yup.string().required('Campo requerido'),
    internshipHours: yup.number().required('Campo requerido'),
    vinculationHours: yup.number().required('Campo requerido'),
  })

  const onSubmit = async (values: CouncilModel) => {
    if (values.id) {
      await handleUpdateCareer(values)
      formik.resetForm()
      return
    }

    await handleCreateCareer(
      new CouncilModel({
        ...values,
      }),
    )
    formik.resetForm()
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: new CouncilModel({
      name: values.name || '',
      isActive: values.isActive || false,
    }),
    validationSchema,
    onSubmit,
  })

  const handleCreateCareer = async (values: CouncilModel) => {
    try {
      const result = await CouncilsUseCasesImpl.getInstance().create(values)

      if (result.council) {
        setCouncils([...councils, result.council])
        toast.success('Carrera creada exitosamente')
        onClose()
      } else {
        toast.error('Error al crear la carrera', {
          closeButton: false,
        })
      }
    } catch (error) {
      toast.error('Ocurrió un error al crear la carrera')
    }
  }

  const handleUpdateCareer = async (values: CouncilModel) => {
    try {
      const { status } = await CouncilsUseCasesImpl.getInstance().update(
        values.id!,
        values,
      )

      if (status === HTTP_STATUS_CODES.OK) {
        setCouncils(
          councils!.map((career) => {
            if (career.id === values.id) {
              return new CouncilModel({
                ...career,
                ...values,
              })
            }

            return career
          }),
        )
        toast.success('Carrera actualizada exitosamente')
        onClose()
      } else {
        toast.error('Error al actualizar la carrera', {
          closeButton: false,
        })
        onClose()
      }
    } catch (error) {
      toast.error('Ocurrió un error al actualizar la carrera')
      onClose()
    }
  }

  return { formik, careers: councils, setCareers: setCouncils }
}
