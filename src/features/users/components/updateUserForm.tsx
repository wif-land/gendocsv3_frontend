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
import { IUser } from '../../auth/domain/entities/IUser'

const UpdateUserForm = ({
  user,
  onClose,
}: {
  user: IUser
  onClose: () => void
}) => {
  const [defaultValue, setValue] = React.useState<boolean>()
  const [modules, setModules] = useState<IModule[]>([]) // State para guardar los módulos
  const rolesArray = ['ADMIN', 'WRITTER', 'READER']

  const [selectedModules, setSelectedModules] = useState<Selection>(
    new Set(user.accessModules?.map((module) => module.toString())),
  )

  useEffect(() => {
    let isMounted = true

    const handleSetSelectedModules = () => {
      if (user.accessModules && isMounted) {
        setSelectedModules(
          new Set(user.accessModules.map((module) => module.toString())),
        )
      }
    }

    handleSetSelectedModules()

    return () => {
      isMounted = false
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

    formik.setFieldValue(id, numberArray)
  }

  const { formik, setUserId } = useUpdateUser()

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

  useEffect(() => {
    let isMounted = true

    const handleUserValues = () => {
      if (user && isMounted) {
        setUserId(user.id)
        setValue(user.isActive)
      }
    }

    handleUserValues()

    return () => {
      isMounted = false
    }
  }, [user.id])

  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        className="w-full justify-items-center "
      >
        <div className="grid grid-cols-2 gap-4 w-6/6 justify-items-center">
          <Input
            id="firstName"
            name="firstName"
            type="firstName"
            label="Primer Nombre"
            variant="underlined"
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
            variant="underlined"
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
            variant="underlined"
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
            variant="underlined"
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
            variant="underlined"
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
            variant="underlined"
            onChange={formik.handleChange}
            size="lg"
            errorMessage={
              formik.touched.password && formik.errors.password
                ? formik.errors.password
                : ''
            }
            className="w-full"
          />
          <div className="w-full">
            <Select
              id="accessModules"
              name="accessModules"
              label="Módulos de acceso"
              variant="underlined"
              placeholder="Selecciona los módulos"
              selectionMode="multiple"
              className="max-w-xs"
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
            <p className="text-xs text-neutral-600">
              Modulos seleccionados: {Array.from(selectedModules).join(', ')}
            </p>
          </div>

          <Select
            id="roles"
            name="roles"
            label="Roles"
            variant="underlined"
            placeholder="Selecciona los roles"
            description="Selecciona los roles del usuario"
            selectionMode="multiple"
            onSelectionChange={(value) => handleSelectChange('roles', value)}
            defaultSelectedKeys={user.roles || []}
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
            isSelected={defaultValue}
            className="mb-4"
            onValueChange={(defaultValue) => {
              const fakeEvent = {
                target: {
                  name: 'isActive',
                  defaultValue,
                },
              }
              setValue(defaultValue)
              formik.handleChange(fakeEvent)
            }}
          >
            Usuario activo
          </Switch>
        </div>
        <div className="flex justify-center m-2">
          <Button
            type="submit"
            size="lg"
            radius="sm"
            className="bg-blue-600 w-56 m-1 text-white"
            disabled={formik.isSubmitting}
            onClick={onClose}
          >
            Actualizar
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
    </>
  )
}

export default UpdateUserForm
