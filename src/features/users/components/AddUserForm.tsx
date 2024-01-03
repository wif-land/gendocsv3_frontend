import React, { useEffect, useState } from 'react'
import { useUser } from '../hook/useUser'
import {
  Button,
  Input,
  Select,
  SelectItem,
  Selection,
  Switch,
} from '@nextui-org/react'
import { fetchModules } from '../../../features/modules/api/modules'
import { IModule } from '../../modules/types/IModule'
import { IRoleType } from '../../../features/auth/types/IUser'
import { useRouter } from 'next/navigation'

const AddUserForm = () => {
  const router = useRouter()
  const { formik } = useUser()
  const [value, setValue] = React.useState<Selection>(new Set([]))
  const [modules, setModules] = useState<IModule[] | undefined>([]) // State para guardar los módulos
  const rolesArray: IRoleType[] = ['admin', 'writer', 'reader']

  const handleSelectChange = (name: string, value: Selection) => {
    formik.setFieldValue(name, Array.from(value))
  }

  const handleModuleChange = (name: string, value: Selection) => {
    setValue(value)
    formik.setFieldValue(name, Array.from(value))
  }

  useEffect(() => {
    const fetchAndSetModules = async () => {
      const fetchedModules = await fetchModules()
      setModules(fetchedModules.modules)
    }
    fetchAndSetModules()
  }, [])

  return (
    <>
      <div className="flex h-screen ">
        <div className="flex-1 flex flex-col justify-center items-center">
          <form
            onSubmit={formik.handleSubmit}
            className="w-3/4 justify-items-center pl-16 pb-32"
          >
            <div className="grid grid-cols-2 gap-4 justify-items-center  ">
              <Input
                id="firstName"
                name="firstName"
                type="firstName"
                label="Primer Nombre"
                variant="bordered"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                size="lg"
                errorMessage={
                  formik.touched.firstName && formik.errors.firstName
                    ? formik.errors.firstName
                    : ''
                }
                className="w-full"
              />
              <Input
                id="secondName"
                name="secondName"
                type="secondName"
                label="Segundo Nombre"
                variant="bordered"
                value={formik.values.secondName}
                onChange={formik.handleChange}
                size="lg"
                errorMessage={
                  formik.touched.secondName && formik.errors.secondName
                    ? formik.errors.secondName
                    : ''
                }
                className="w-full"
              />
              <Input
                id="firstLastName"
                name="firstLastName"
                type="firstLastName"
                label="Primer Apellido"
                variant="bordered"
                value={formik.values.firstLastName}
                onChange={formik.handleChange}
                size="lg"
                errorMessage={
                  formik.touched.firstLastName && formik.errors.firstLastName
                    ? formik.errors.firstLastName
                    : ''
                }
                className="w-full"
              />
              <Input
                id="secondLastName"
                name="secondLastName"
                type="secondLastName"
                label="Segundo Apellido"
                variant="bordered"
                value={formik.values.secondLastName}
                onChange={formik.handleChange}
                size="lg"
                errorMessage={
                  formik.touched.secondLastName && formik.errors.secondLastName
                    ? formik.errors.secondLastName
                    : ''
                }
                className="w-full"
              />
              <Input
                id="googleEmail"
                name="googleEmail"
                type="googleEmail"
                label="Google Email"
                variant="bordered"
                value={formik.values.googleEmail}
                onChange={formik.handleChange}
                size="lg"
                errorMessage={
                  formik.touched.googleEmail && formik.errors.googleEmail
                    ? formik.errors.googleEmail
                    : ''
                }
                className="w-full"
              />
              <Input
                id="outlookEmail"
                name="outlookEmail"
                type="outlookEmail"
                label="Outlook Email"
                variant="bordered"
                value={formik.values.outlookEmail}
                onChange={formik.handleChange}
                size="lg"
                errorMessage={
                  formik.touched.outlookEmail && formik.errors.outlookEmail
                    ? formik.errors.outlookEmail
                    : ''
                }
                className="w-full"
              />
              <Input
                id="password"
                name="password"
                type="text"
                label="Contraseña"
                variant="bordered"
                value={formik.values.password}
                onChange={formik.handleChange}
                size="lg"
                errorMessage={
                  formik.touched.password && formik.errors.password
                    ? formik.errors.password
                    : ''
                }
                className="w-full"
              />
              {/* <Select
                id="accessModules"
                name="accessModules"
                label="Favorite Animal"
                variant="bordered"
                placeholder="Select an animal"
                description="Selecciona los modulos a los que tendra acceso el usuario"
                selectionMode="multiple"
                selectedKeys={value}
                onSelectionChange={(value) =>
                  handleModuleChange('accessModules', value)
                }
                className="max-w-xs"
              >
                {modules!.map((module) => (
                  <SelectItem key={module.name} value={module.name}>
                    {module.name}
                  </SelectItem>
                ))}
              </Select>
              <p className="text-default-500 text-small">
                Selected: {Array.from(value).join(', ')}
              </p> */}
              <Select
                id="roles"
                name="roles"
                label="Roles"
                variant="bordered"
                placeholder="Selecciona los roles"
                description="Selecciona los roles del usuario"
                selectionMode="multiple"
                onSelectionChange={(value) =>
                  handleSelectChange('roles', value)
                }
                className="w-full"
              >
                {rolesArray!.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </Select>
              <Switch
                id="isActive"
                name="isActive"
                size="sm"
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
                Usuario activo
              </Switch>
            </div>
            <div className="flex justify-center items center  m-2">
              <Button
                type="submit"
                size="lg"
                className="w-1/2 m-4 bg-blue-600 text-white"
                disabled={formik.isSubmitting}
              >
                Crear
              </Button>
              <Button
                type="reset"
                size="lg"
                className="w-1/2 m-4 bg-red-600 text-white"
                disabled={formik.isSubmitting}
                onClick={()=>{window.history.back();}}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default AddUserForm
