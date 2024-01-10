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
import { useEffect } from 'react'
import { CouncilModel } from '../../data/models/CouncilModel'
import { useCouncilsForm } from '../hooks/useCouncilsForm'
import { CouncilType } from '../../domain/entities/ICouncil'

interface CouncilsFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  values?: CouncilModel
  onClose: () => void
  isSubmitting?: boolean
}

export const CouncilsForm = ({
  isOpen,
  onOpenChange,
  values = new CouncilModel({
    name: '',
    isActive: false,
    date: new Date(),
    isArchived: false,
    type: CouncilType.EXTRAORDINARY,
  }),
  onClose,
}: CouncilsFormProps) => {
  const isAddMode = !values.id
  const { formik } = useCouncilsForm(values, onClose)

  useEffect(() => {
    if (!values.id) return

    formik.setValues(values)
  }, [values])

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {!isAddMode ? 'Editar consejo' : 'Crear consejo'}
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
