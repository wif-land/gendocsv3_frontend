import { Button, Input, Switch } from '@nextui-org/react'
import { useAddProcess } from '../hooks/useAddProcess'
import React, { useEffect } from 'react'
import { useUserStore } from '../../../shared/store/userProfileStore'

const AddProcessForm = ({
  onClose,
  moduleId,
}: {
  onClose: () => void
  moduleId: string | string[]
}) => {
  const { formik } = useAddProcess()
  const { user } = useUserStore()

  useEffect(() => {
    formik.setFieldValue('moduleId', moduleId)
    formik.setFieldValue('userId', user?.id)
  }, [])

  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col items-center justify-center"
      >
        <div className="flex flex-col gap-2">
          <Input
            type="text"
            name="processName"
            id="processName"
            label="Nombre del proceso"
            variant="bordered"
            onChange={formik.handleChange}
            defaultValue={formik.values.processName}
          />
          <Switch
            id="isActive"
            name="isActive"
            size="sm"
            defaultChecked={true}
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
            Proceso Activo
          </Switch>
          <div className="flex gap-5">
            <Button
              type="submit"
              size="lg"
              className="w-1/2 m-4 bg-blue-600 text-white"
              disabled={
                formik.isSubmitting ||
                !formik.isValid ||
                !formik.dirty ||
                !formik.touched
              }
              onClick={onClose}
            >
              Crear
            </Button>
            <Button
              size="lg"
              className="w-1/2 m-4 bg-red-600 text-white"
              onPress={onClose}
            >
              Cerrar
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}
export default AddProcessForm
