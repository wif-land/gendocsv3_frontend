/* eslint-disable no-magic-numbers */
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
} from '@nextui-org/react'
import * as yup from 'yup'
import { ICareer } from '../domain/entities/ICareer'
import { CareerApi } from '../api/careersApi'
import { toast } from 'react-toastify'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'
import { useFormik } from 'formik'
import { useEffect } from 'react'
import { useFunctionaryStore } from '../../functionaries/presentation/state/useFunctionaryStore'
import { useCareersStore } from '../presentation/state/careerStore'

export const CareersForm = ({
  isOpen,
  onOpenChange,
  values = {
    name: '',
    credits: 0,
    menDegree: '',
    womenDegree: '',
    isActive: true,
    coordinator: 0,
    internshipHours: 0,
    vinculationHours: 0,
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
  const { functionaries } = useFunctionaryStore()

  const validationSchema = yup.object({
    name: yup.string().required('Campo requerido'),
    credits: yup.number().required('Campo requerido').max(140).min(130),
    menDegree: yup.string().required('Campo requerido'),
    womenDegree: yup.string().required('Campo requerido'),
    coordinator: yup.string().required('Campo requerido'),
    internshipHours: yup.number().required('Campo requerido').max(250).min(230),
    vinculationHours: yup.number().required('Campo requerido').max(95).min(80),
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
    enableReinitialize: true,
    initialValues: {
      name: values.name || '',
      credits: values.credits || 0,
      menDegree: values.menDegree || '',
      womenDegree: values.womenDegree || '',
      isActive: values.isActive,
      coordinator: values.coordinator || 0,
      internshipHours: values.internshipHours || 0,
      vinculationHours: values.vinculationHours || 0,
    },
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

      if (status === HTTP_STATUS_CODES.OK) {
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

  useEffect(() => {
    if (!values.id) return

    formik.setValues({
      ...values,
      credits: values.credits,
    })
  }, [values])

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
                <Input
                  id="internshipHours"
                  name="internshipHours"
                  type="internshipHours"
                  label="Horas de prácticas"
                  variant="underlined"
                  placeholder="Eg. 45"
                  className="w-full"
                  value={
                    formik.values.internshipHours.toString() ??
                    values.internshipHours
                  }
                  onChange={(e) =>
                    formik.setFieldValue(
                      'internshipHours',
                      Number(e.target.value),
                    )
                  }
                  onBlur={formik.handleBlur}
                  size="lg"
                  errorMessage={
                    formik.touched.internshipHours &&
                    formik.errors.internshipHours
                      ? formik.errors.internshipHours
                      : ''
                  }
                />
                <Input
                  id="vinculationHours"
                  name="vinculationHours"
                  type="vinculationHours"
                  label="Horas de vinculación"
                  variant="underlined"
                  placeholder="Eg. 45"
                  className="w-full"
                  value={
                    formik.values.vinculationHours.toString() ??
                    values.vinculationHours
                  }
                  onChange={(e) =>
                    formik.setFieldValue(
                      'vinculationHours',
                      Number(e.target.value),
                    )
                  }
                  onBlur={formik.handleBlur}
                  size="lg"
                  errorMessage={
                    formik.touched.vinculationHours &&
                    formik.errors.vinculationHours
                      ? formik.errors.vinculationHours
                      : ''
                  }
                />

                <Select
                  label="Funcionario"
                  className="w-full"
                  placeholder="Coordinador"
                  variant="underlined"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  defaultSelectedKeys={[(formik.values.coordinator as any).id]}
                  onChange={(e) =>
                    formik.setFieldValue('coordinator', Number(e.target.value))
                  }
                >
                  {functionaries! &&
                    functionaries?.map((functionary) => {
                      const functionaryName = `${functionary.firstName} ${functionary.firstLastName}`
                      return (
                        <SelectItem
                          key={functionary.id as number}
                          value={functionary.id as number}
                        >
                          {functionaryName}
                        </SelectItem>
                      )
                    })}
                </Select>

                {isAddMode && (
                  <Switch
                    aria-label="Automatic updates"
                    isSelected={formik.values.isActive}
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
                )}
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
