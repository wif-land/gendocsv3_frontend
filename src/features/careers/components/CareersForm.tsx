import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
} from '@nextui-org/react'
import * as yup from 'yup'
import { ICareer } from '../interfaces/ICareer'
import { CareerApi } from '../api/careersApi'
import { toast } from 'react-toastify'
import { useCareersStore } from '../../../shared/store/careerStore'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'
import { useFormik } from 'formik'

export const CareersForm = ({
  isOpen,
  onOpenChange,
  values = {
    name: '',
    credits: 0,
    menDegree: '',
    womenDegree: '',
    isActive: true,
  },
  onClose,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  values?: ICareer
  onClose: () => void
  isSubmitting?: boolean
}) => {
  const isAddMode = !values.id
  const { careers, setCareers } = useCareersStore()

  const validationSchema = yup.object({
    name: yup.string().required('Campo requerido'),
    credits: yup.number().required('Campo requerido'),
    menDegree: yup.string().required('Campo requerido'),
    womenDegree: yup.string().required('Campo requerido'),
  })

  const onSubmit = async (values: ICareer) => {
    if (values.id) {
      await handleUpdateCareer(values)
      formik.resetForm()
      return
    }

    await handleCreateCareer({
      ...values,
      credits: Number(values.credits),
    })
    formik.resetForm()
  }

  const formik = useFormik({
    initialValues: values,
    validationSchema,
    onSubmit,
  })

  const handleCreateCareer = async (values: ICareer) => {
    try {
      const result = await CareerApi.create(values)

      if (result.career) {
        setCareers([...(careers as ICareer[]), result.career])
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

  const handleUpdateCareer = async (values: ICareer) => {
    try {
      const { status } = await CareerApi.update(values.id!, values)

      if (status === HTTP_STATUS_CODES.ACCEPTED) {
        setCareers(
          careers!.map((career) => {
            if (career.id === values.id) {
              return {
                ...career,
                ...values,
              }
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
      }
    } catch (error) {
      toast.error('Ocurrió un error al actualizar la carrera')
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {!isAddMode ? 'Editar carrera' : 'Crear carrera'}
            </ModalHeader>
            <form
              onSubmit={async (e) => {
                formik.handleSubmit(e)
              }}
            >
              <ModalBody>
                <Input
                  id="name"
                  name="name"
                  type="name"
                  label="Nombre"
                  variant="underlined"
                  placeholder="Eg. Ingeniería en Sistemas"
                  className="w-full"
                  defaultValue={values.name ? values.name : ''}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  size="lg"
                  errorMessage={
                    formik.touched.name && formik.errors.name
                      ? formik.errors.name
                      : ''
                  }
                />
                <Input
                  id="credits"
                  name="credits"
                  type="credits"
                  label="Créditos"
                  variant="underlined"
                  placeholder="Eg. 240"
                  className="w-full"
                  defaultValue={values.credits ? values.credits.toString() : ''}
                  value={formik.values.credits.toString()}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  size="lg"
                  errorMessage={
                    formik.touched.credits && formik.errors.credits
                      ? formik.errors.credits
                      : ''
                  }
                />
                <Input
                  id="menDegree"
                  name="menDegree"
                  type="menDegree"
                  label="Título Masculino"
                  variant="underlined"
                  placeholder="Eg. Ingeniero en Sistemas"
                  className="w-full"
                  value={formik.values.menDegree ?? values.menDegree}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  size="lg"
                  errorMessage={
                    formik.touched.menDegree && formik.errors.menDegree
                      ? formik.errors.menDegree
                      : ''
                  }
                />
                <Input
                  id="womenDegree"
                  name="womenDegree"
                  type="womenDegree"
                  label="Título Femenino"
                  variant="underlined"
                  placeholder="Eg. Ingeniera en Sistemas"
                  className="w-full"
                  value={formik.values.womenDegree ?? values.womenDegree}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  size="lg"
                  errorMessage={
                    formik.touched.womenDegree && formik.errors.womenDegree
                      ? formik.errors.womenDegree
                      : ''
                  }
                />
                <Switch
                  defaultSelected
                  aria-label="Automatic updates"
                  onValueChange={(value) => {
                    const fakeEvent = {
                      target: {
                        name: 'isActive',
                        value,
                      },
                    }

                    formik.handleChange(fakeEvent)
                  }}
                >
                  Activo
                </Switch>
              </ModalBody>

              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    formik.resetForm()
                    onClose()
                  }}
                >
                  Cancelar
                </Button>

                <Button
                  color="primary"
                  disabled={formik.isSubmitting}
                  type="submit"
                >
                  {isAddMode ? 'Crear' : 'Editar'}
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
