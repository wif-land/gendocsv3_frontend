'use client'
import React, { useEffect, useState } from 'react'
import { useUpdateUser } from '../hook/useUpdateUser'
import {
  Button,
  Input,
  Select,
  SelectItem,
  Selection,
  Switch,
} from '@nextui-org/react'
import { fetchModules } from '../../modules/api/modules'
import { IModule } from '../../modules/types/IModule'
import { IUser } from '@/features/auth/types/IUser'

const UpdateUserForm = ({ user }: { user: IUser }) => {
  const [defaultValue, setValue] = React.useState<Selection>(new Set([]))
  const [modules, setModules] = useState<IModule[]>([]) // State para guardar los módulos
  const rolesArray = ['ADMIN', 'WRITTER', 'READER']

  const [selectedModules, setSelectedModules] = useState<Selection>(
    new Set(user.accessModules?.map((mod) => mod.id.toString())),
  )

  useEffect(() => {
    if (user.accessModules) {
      setSelectedModules(
        new Set(user.accessModules.map((mod) => mod.id.toString())),
      )
    }
  }, [user.accessModules])

  const handleSelectChange = (name: string, defaultValue: Selection) => {
    formik.setFieldValue(name, Array.from(defaultValue))
  }

  const handleModuleChange = (id: string, value: Selection) => {
    // Convertir cada valor del Set a número y luego actualizar el estado con el nuevo array
    const numberArray = Array.from(value).map((val) => {
      // Asegúrate de que val sea tratado como una cadena si no es un número
      const valueAsString = typeof val === 'number' ? val.toString() : val
      return parseInt(valueAsString, 10)
    })

    setValue(new Set(numberArray))
    formik.setFieldValue(id, numberArray)
  }

  const { formik, setUserId } = useUpdateUser()
  useEffect(() => {
    const fetchAndSetModules = async () => {
      const fetchedModules = await fetchModules()
      if (fetchedModules.modules) {
        setModules(fetchedModules.modules)
      }
    }
    fetchAndSetModules()
    // console.log(user.id)
  }, [])

  useEffect(() => {
    setUserId(user.id)
    console.log(user.roles)
  }, [user.id])

  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        className="w-full flex flex-col justify-center  items-center"
      >
        <div className="flex flex-col gap-4 justify-items-center ">
          <Input
            id="firstName"
            name="firstName"
            type="firstName"
            label="Primer Nombre"
            variant="bordered"
            defaultValue={user.firstName}
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
            defaultValue={user.secondName}
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
            defaultValue={user.firstLastName}
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
            defaultValue={user.secondLastName}
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
            id="outlookEmail"
            name="outlookEmail"
            type="email"
            label="Outlook Email"
            variant="bordered"
            defaultValue={user.outlookEmail}
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
            id="accessModules"
            name="accessModules"
            label="Módulos de acceso"
            variant="bordered"
            placeholder="Selecciona los módulos"
            description="Selecciona los módulos a los que tendrá acceso el usuario"
            selectionMode="multiple"
            selectedKeys={selectedModules}
            onSelectionChange={(value) => {
              handleModuleChange('accessModules', value)
              setSelectedModules(value)
            }}
          >
            {modules?.map((module) => (
              <SelectItem key={module.id} value={module.id.toString()}>
                {module.name}
              </SelectItem>
            ))}
          </Select>
          <p>Modulos seleccionados: {Array.from(selectedModules).join(', ')}</p>
          <Switch
            id="isActive"
            name="isActive"
            size="sm"
            onValueChange={(defaultValue) => {
              const fakeEvent = {
                target: {
                  name: 'isActive',
                  defaultValue,
                },
              }
              formik.handleChange(fakeEvent)
            }}
          >
            Usuario activo
          </Switch>
          <Select
            id="roles"
            name="roles"
            label="Roles"
            variant="bordered"
            placeholder="Selecciona los roles"
            description="Selecciona los roles del usuario"
            selectionMode="multiple"
            onSelectionChange={(value) => handleSelectChange('roles', value)}
            defaultSelectedKeys={user.roles || []}
            className="max-w-xs"
          >
            {rolesArray!.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex justify-center">
          <Button
            type="submit"
            size="lg"
            className="w-1/2"
            disabled={formik.isSubmitting}
          >
            Actualizar
          </Button>
        </div>
      </form>
    </>
  )
}

export default UpdateUserForm
