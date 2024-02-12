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
import { useProcessForm } from '../hooks/useProcessesForm'
import { useAccountStore } from '../../../auth/presentation/state/useAccountStore'
import { IProcess } from '../../domain/entities/IProcess'

interface ProcessesFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  values?: IProcess
  isSubmitting?: boolean
}

export const ProcessesForm = ({
  isOpen,
  onOpenChange,
  values,
}: ProcessesFormProps) => {
  const { user } = useAccountStore()
  const isAddMode = !values?.id
  const { formik, methods } = useProcessForm(values ?? ({} as IProcess))

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
