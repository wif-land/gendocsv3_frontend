import { Button, Input, Switch } from '@nextui-org/react'
import React, { useEffect } from 'react'
import { useAccountStore } from '../../auth/presentation/state/useAccountStore'
import useModulesStore from '../../../shared/store/modulesStore'
import { IProcess } from '../types/IProcess'
import { useEditProcess } from '../hooks/useEditProcess'

const EditProcessForm = ({
  onClose,
  moduleId,
  process,
}: {
  onClose: () => void
  moduleId: string
  process: IProcess
}) => {
  const { formik, setProcessId } = useEditProcess()
  const { user } = useAccountStore()
  const { modules } = useModulesStore()

  useEffect(() => {
    const module = modules?.find(
      (module) => module.code === moduleId.toUpperCase(),
    )

    setProcessId(process?.id)

    formik.setFieldValue('moduleId', module?.id)

    formik.setFieldValue('userId', user?.id)

    formik.setFieldValue('isActive', process?.isActive)
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
            defaultValue={process?.name}
          />
          <Switch
            id="isActive"
            name="isActive"
            size="sm"
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
              Guardar
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
export default EditProcessForm
