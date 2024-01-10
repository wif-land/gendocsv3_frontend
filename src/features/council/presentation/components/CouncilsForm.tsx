/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  Switch,
} from '@nextui-org/react'
import { useEffect } from 'react'
import { useCouncilsForm } from '../hooks/useCouncilsForm'
import {
  CouncilType,
  CouncilTypeLabels,
  ICouncil,
} from '../../domain/entities/ICouncil'
import { Calendar } from '../../../../shared/components/Calendar'
import { DateUtils } from '../../../../shared/utils/dateUtils'
import { useUserStore } from '../../../../shared/store/userProfileStore'

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
  const { user } = useUserStore()
  const isAddMode = !values?.id
  const { formik } = useCouncilsForm(values ?? ({} as ICouncil), () =>
    onOpenChange(false),
  )

  useEffect(() => {
    formik.setFieldValue('userId', user?.id)
    formik.setFieldValue('moduleId', values?.moduleId)
    formik.setFieldValue('type', Object.keys(CouncilType)[1])

    if (isAddMode) return
    formik.setValues(values)
  }, [values])

  const handleSelectChange = (name: string, value: any) => {
    const numericValue = !isNaN(value) ? Number(value) : value
    formik.setFieldValue(name, numericValue)
  }

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

                <Popover placement="top" className="w-full">
                  <PopoverTrigger>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      label="Fecha de ejecución"
                      variant="underlined"
                      placeholder="Presione para seleccionar una fecha"
                      className={`font-normal ${
                        !formik.values.date && 'text-muted-foreground'
                      }`}
                      value={
                        formik.values.date
                          ? DateUtils.parseStringDateToISO(formik.values.date)
                          : undefined
                      }
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      size="lg"
                      errorMessage={
                        formik.touched.date && formik.errors.date
                          ? (formik.errors.date as string)
                          : ''
                      }
                    />
                  </PopoverTrigger>

                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={formik.values.date!}
                      onSelect={(e) => {
                        formik.setFieldValue('date', e)
                      }}
                      defaultMonth={formik.values.date}
                      captionLayout="dropdown"
                      fromYear={new Date().getFullYear()}
                      toYear={new Date().getFullYear() + 1}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Select
                  id="type"
                  name="type"
                  label="Tipo"
                  variant="underlined"
                  className="w-full"
                  value={formik.values.type}
                  onChange={(e) => handleSelectChange('type', e.target.value)}
                  onBlur={formik.handleBlur}
                  size="lg"
                  errorMessage={
                    formik.touched.type && formik.errors.type
                      ? formik.errors.type
                      : ''
                  }
                  selectedKeys={[formik.values.type]}
                >
                  {Object.keys(CouncilType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {CouncilTypeLabels[type as keyof typeof CouncilType]}
                    </SelectItem>
                  ))}
                </Select>

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
