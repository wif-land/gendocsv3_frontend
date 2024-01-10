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
import { useCouncilsForm } from '../hooks/useCouncilsForm'
import { ICouncil } from '../../domain/entities/ICouncil'

interface CouncilsFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  values?: ICouncil
  isSubmitting?: boolean
}

export const CouncilsForm = ({
  isOpen,
  onOpenChange,
  values,
}: CouncilsFormProps) => {
  const isAddMode = !values?.id
  const { formik } = useCouncilsForm(values ?? ({} as ICouncil), () =>
    onOpenChange(false),
  )

  useEffect(() => {
    if (isAddMode) return

    formik.setValues(values)
  }, [values])

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {isAddMode ? 'Crear consejo' : 'Editar consejo'}
            </ModalHeader>

            <form onSubmit={formik.handleSubmit}>
              <ModalBody>
                <Input
                  id="name"
                  name="name"
                  type="name"
                  label="Nombre"
                  variant="underlined"
                  placeholder="Eg. Ingeniería en Sistemas"
                  className="w-full"
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
                    aria-label="Activo"
                    isSelected={formik.values.isActive}
                    onValueChange={(value) =>
                      formik.setFieldValue('isActive', value)
                    }
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
                  isDisabled={formik.isSubmitting || !formik.isValid}
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
