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
import { useTemplatesForm } from '../hooks/useTemplatesForm'
import { useUserStore } from '../../../../shared/store/userProfileStore'
import { ITemplate } from '../../domain/entities/ITemplate'

interface ProcessesFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  values?: ITemplate
  isSubmitting?: boolean
  processId?: number
}

export const TemplatesForm = ({
  isOpen,
  onOpenChange,
  values,
}: ProcessesFormProps) => {
  const { user } = useUserStore()
  const isAddMode = !values?.id
  const { formik } = useTemplatesForm(values ?? ({} as ITemplate), () =>
    onOpenChange(false),
  )

  useEffect(() => {
    formik.setFieldValue('userId', user?.id)
    formik.setFieldValue('processId', values?.processId)

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
              {isAddMode ? 'Crear plantilla' : 'Editar plantilla'}
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
                <Switch
                  id="hasStudent"
                  name="hasStudent"
                  aria-label="Activo"
                  isSelected={formik.values.hasStudent}
                  onValueChange={(value) =>
                    formik.setFieldValue('hasStudent', value)
                  }
                >
                  Participan estudiantes
                </Switch>
                <Switch
                  id="hasFunctionary"
                  name="hasFunctionary"
                  aria-label="Activo"
                  isSelected={formik.values.hasFunctionary}
                  onValueChange={(value) =>
                    formik.setFieldValue('hasFunctionary', value)
                  }
                >
                  Participan funcionarios
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
