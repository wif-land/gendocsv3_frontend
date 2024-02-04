import React, { useEffect, useState } from 'react'
import { useAddUser } from '../hook/useAddUser'
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

const AddUserForm = ({ onClose }: { onClose: () => void }) => {
  const { formik } = useAddUser()
  const [value, setValue] = React.useState<Selection>(new Set([]))
  const [modules, setModules] = useState<IModule[] | undefined>([]) // State para guardar los módulos
  const rolesArray = ['ADMIN', 'WRITER', 'READER']

  const handleSelectChange = (name: string, value: Selection) => {
    formik.setFieldValue(name, Array.from(value))
  }

  const handleModuleChange = (id: string, value: Selection) => {
    const numberArray = Array.from(value).map((val) => {
      const valueAsString = typeof val === 'number' ? val.toString() : val
      return parseInt(valueAsString, 10)
    })

    setValue(new Set(numberArray))
    formik.setFieldValue(id, numberArray)
  }

  useEffect(() => {
    let isMounted = true

    const fetchAndSetModules = async () => {
      const fetchedModules = await fetchModules()

      if (fetchedModules.modules && isMounted) {
        setModules(fetchedModules.modules)
      }
    }

    fetchAndSetModules()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-full justify-items-center "
    >
      <div className=" grid grid-cols-2 gap-4 w-6/6 justify-items-center ">
        <Input
          id="firstName"
          name="firstName"
          type="firstName"
          label="Primer Nombre"
          variant="underlined"
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
          variant="underlined"
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
          variant="underlined"
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
          variant="underlined"
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
          variant="underlined"
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
          variant="underlined"
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
          variant="underlined"
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
        <Select
          id="roles"
          name="roles"
          label="Roles"
          variant="underlined"
          placeholder="Selecciona los roles"
          selectionMode="multiple"
          onSelectionChange={(value) => handleSelectChange('roles', value)}
          className="w-full"
        >
          {rolesArray!.map((role) => (
            <SelectItem key={role} value={role}>
              {role}
            </SelectItem>
          ))}
        </Select>
        <Select
          id="accessModules"
          name="accessModules"
          label="Módulos de Acceso"
          variant="underlined"
          placeholder="Selecciona un módulo"
          selectionMode="multiple"
          selectedKeys={Array.from(value).map(String)} // Convierte los números a cadenas si es necesario
          onSelectionChange={(value) =>
            handleModuleChange('accessModules', value)
          }
          className="w-full"
        >
          {modules!.map((module) => (
            <SelectItem key={module.id} textValue={module.name}>
              {module.name}
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
      <div className="flex justify-center items center  m-4 ">
        <Button
          type="submit"
          size="lg"
          radius="sm"
          className="w-56 m-1 bg-blue-600 text-white"
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
          className="bg-red-600 w-56 m-1 text-white"
          size="lg"
          radius="sm"
          disabled={formik.isSubmitting}
          onPress={() => {
            formik.resetForm()
            onClose()
          }}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}

export default AddUserForm
