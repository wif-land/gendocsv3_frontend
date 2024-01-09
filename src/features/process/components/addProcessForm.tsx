import { Button, Input, Switch } from '@nextui-org/react'
import { useAddProcess } from '../hooks/useAddProcess'
import React, { useEffect } from 'react'
import { useUserStore } from '../../../shared/store/userProfileStore'
import useModulesStore from '../../../shared/store/modulesStore'

const AddProcessForm = ({
  onClose,
  moduleId,
}: {
  onClose: () => void
  moduleId: string
}) => {
  const { formik } = useAddProcess()
  const { user } = useUserStore()
  const { modules } = useModulesStore()

  useEffect(() => {
    const module = modules?.find(
      (module) => module.code === moduleId.toUpperCase(),
    )

    formik.setFieldValue('moduleId', module?.id)

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
            name="name"
            id="name"
            label="Nombre del proceso"
            variant="bordered"
            onChange={formik.handleChange}
            defaultValue={formik.values.name}
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
