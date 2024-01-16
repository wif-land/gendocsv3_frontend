/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useProcessesForm } from '../hooks/useProcessesForm'
import { useUserStore } from '../../../../shared/store/userProfileStore'
import { IDocument } from '../../domain/entities/IProcess'

interface ProcessesFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  values?: IDocument
  isSubmitting?: boolean
}

export const ProcessesForm = ({
  isOpen,
  onOpenChange,
  values,
}: ProcessesFormProps) => {
  const { user } = useUserStore()
  const isAddMode = !values?.id
  const { formik } = useProcessesForm(values ?? ({} as IDocument), () =>
    onOpenChange(false),
  )

  useEffect(() => {
    formik.setFieldValue('userId', user?.id)
    formik.setFieldValue('moduleId', values?.moduleId)

    if (isAddMode) return
    formik.setValues(values)
  }, [values])

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={() => {
        formik.resetForm()
        onOpenChange(false)
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {isAddMode ? 'Crear proceso' : 'Editar proceso'}
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
                    id="isActive"
                    name="isActive"
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
                  isDisabled={formik.isSubmitting}
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
