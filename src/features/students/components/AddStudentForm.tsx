import React, { useEffect, useState } from 'react'
import cantones from '../../../features/students/data/canton'

import { Button, Input, Select, SelectItem, Switch } from '@nextui-org/react'
import { useStudent } from '../hooks/useAddStudent'
import { ICareer } from '../../../features/careers/types/ICareer'
import { CareersApi } from '../../../features/careers/api/carers'

const AddStudentForm = ({ onClose }: { onClose: () => void }) => {
  const { formik } = useStudent()
  const [careers, setCareers] = useState<ICareer[]>([])

  const genders = [
    {
      value: 'M',
      label: 'Masculino',
    },
    {
      value: 'F',
      label: 'Femenino',
    },
  ]

  useEffect(() => {
    let isMounted = true

    const fetchCareers = async () => {
      const careers = await CareersApi.fetchCareers()
      if (careers.careers && isMounted) {
        setCareers(
          careers.careers.map((career) => ({
            ...career,
            name: `${career.name}`,
          })),
        )
      }
    }

    fetchCareers()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        className="w-full justify-items-center "
      >
        <div className="grid grid-cols-2 gap-4 w-6/6 justify-items-center ">
          <Input
            id="dni"
            name="dni"
            type="dni"
            label="DNI"
            variant="underlined"
            placeholder="Ingrese un DNI"
            value={formik.values.dni}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            size="lg"
            errorMessage={
              formik.touched.dni && formik.errors.dni ? formik.errors.dni : ''
            }
            className="w-full"
          />
          <Input
            id="firstName"
            name="firstName"
            type="firstName"
            label="Primer Nombre"
            variant="underlined"
            placeholder="Ingrese un primer nombre"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
            placeholder="Ingrese un segundo nombre"
            value={formik.values.secondName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
            label="Apellido"
            variant="underlined"
            placeholder="Ingrese un apellido"
            value={formik.values.firstLastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
            placeholder="Ingrese un segundo apellido"
            value={formik.values.secondLastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            size="lg"
            errorMessage={
              formik.touched.secondLastName && formik.errors.secondLastName
                ? formik.errors.secondLastName
                : ''
            }
            className="w-full"
          />
          <Input
            id="personalEmail"
            name="personalEmail"
            type="personalEmail"
            label="Correo Personal"
            variant="underlined"
            placeholder="Ingrese un email"
            value={formik.values.personalEmail}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            size="lg"
            errorMessage={
              formik.touched.personalEmail && formik.errors.personalEmail
                ? formik.errors.personalEmail
                : ''
            }
            className="w-full"
          />
          <Input
            id="outlookEmail"
            name="outlookEmail"
            type="outlookEmail"
            label="Correo Institucional"
            variant="underlined"
            placeholder="Ingrese un email"
            value={formik.values.outlookEmail}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            size="lg"
            errorMessage={
              formik.touched.outlookEmail && formik.errors.outlookEmail
                ? formik.errors.outlookEmail
                : ''
            }
            className="w-full"
          />
          <Input
            id="regularPhoneNumber"
            name="regularPhoneNumber"
            type="phone"
            label="Telefono Familiar"
            variant="underlined"
            placeholder="Ingrese un telefono"
            value={formik.values.regularPhoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            size="lg"
            errorMessage={
              formik.touched.regularPhoneNumber &&
              formik.errors.regularPhoneNumber
                ? formik.errors.regularPhoneNumber
                : ''
            }
            className="w-full"
          />

          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="phone"
            label="Telefono Celular"
            variant="underlined"
            placeholder="Ingrese un telefono"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            size="lg"
            errorMessage={
              formik.touched.phoneNumber && formik.errors.phoneNumber
                ? formik.errors.phoneNumber
                : ''
            }
            className="w-full"
          />

          <Input
            id="registration"
            name="registration"
            type="registration"
            label="Matricula"
            variant="underlined"
            placeholder="Ingrese una matricula"
            value={formik.values.registration}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            size="lg"
            errorMessage={
              formik.touched.registration && formik.errors.registration
                ? formik.errors.registration
                : ''
            }
            className="w-full"
          />

          <Input
            id="folio"
            name="folio"
            type="folio"
            label="Folio"
            variant="underlined"
            placeholder="Ingrese un folio"
            value={formik.values.folio}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            size="lg"
            errorMessage={
              formik.touched.folio && formik.errors.folio
                ? formik.errors.folio
                : ''
            }
            className="w-full"
          />

          <Input
            id="approvedCredits"
            name="approvedCredits"
            type="text" // Debería ser "text" para permitir la entrada de números como cadena
            label="Creditos Aprobados"
            variant="underlined"
            placeholder="Ingrese créditos aprobados"
            value={formik.values.approvedCredits.toString()}
            onChange={(e) =>
              formik.setFieldValue(
                'approvedCredits',
                parseInt(e.target.value) || 0,
              )
            }
            onBlur={formik.handleBlur}
            size="lg"
            errorMessage={
              formik.touched.approvedCredits && formik.errors.approvedCredits
                ? formik.errors.approvedCredits
                : ''
            }
            className="w-full"
          />

          <Select
            label="Ciudad de Residencia"
            className="w-full"
            placeholder="Ciudad de Residencia"
            variant="underlined"
            onChange={(e) => formik.setFieldValue('canton', e.target.value)}
          >
            {cantones.map((canton) => (
              <SelectItem key={canton.id} value={canton.name}>
                {canton.name}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="Genero"
            className="w-full"
            placeholder="Genero"
            variant="underlined"
            onChange={(e) => formik.setFieldValue('gender', e.target.value)}
          >
            {genders.map((gender) => (
              <SelectItem key={gender.value} value={gender.value}>
                {gender.label}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="Carrera"
            className="w-full"
            placeholder="Carrera"
            variant="underlined"
            onChange={(e) =>
              formik.setFieldValue('careerId', Number(e.target.value))
            }
          >
            {careers.map((career) => (
              <SelectItem key={career.id} value={career.id}>
                {career.name}
              </SelectItem>
            ))}
          </Select>
          <Switch
            id="isActive"
            name="isActive"
            size="sm"
            className="m-2"
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
            Estudiante Activo
          </Switch>
          <input
            type="date"
            id="birthdate"
            name="birthdate"
            onChange={formik.handleChange}
          />
        </div>
        <div className="m-1 w-full flex gap-4 justify-center">
          <Button
            type="submit"
            size="lg"
            className="w-56 m-1 bg-blue-600 text-white"
            radius="sm"
            disabled={formik.isSubmitting}
            onPress={onClose}
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
    </>
  )
}

export default AddStudentForm
