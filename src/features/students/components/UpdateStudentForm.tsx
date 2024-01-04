import React, { useEffect, useState } from 'react'
import cantones from '../data/canton'
import { formatISO } from 'date-fns'

import { Button, Input, Select, SelectItem, Switch } from '@nextui-org/react'
import { useStudent } from '../hooks/useStudent'
import { ICareer } from '../../careers/types/ICareer'
import { CareersApi } from '../../careers/api/carers'

const UpdateStudentForm = ({ onClose }: { onClose: () => void }) => {
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

  const handleSelectChange = (name, value) => {
    // Si el valor es numérico, conviértelo a un número, de lo contrario, déjalo como está.
    const numericValue = !isNaN(value) ? Number(value) : value
    formik.setFieldValue(name, numericValue)
  }

  const handleDateChange = (e) => {
    const { name, value } = e.target
    // Convierte el valor de la fecha a ISO 8601 completo
    const formattedDate = formatISO(new Date(value))
    // Actualiza el valor de Formik para el campo de fecha
    formik.setFieldValue(name, formattedDate)
  }

  useEffect(() => {
    const fetchCareers = async () => {
      const careers = await CareersApi.fetchCareers()
      if (careers.careers) {
        setCareers(
          careers.careers.map((career) => ({
            ...career,
            name: `${career.name}`,
          })),
        )
      }
    }
    fetchCareers()
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
            id="googleEmail"
            name="googleEmail"
            type="googleEmail"
            label="Correo Personal"
            variant="underlined"
            placeholder="Ingrese un email"
            value={formik.values.googleEmail}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
            onChange={(e) => handleSelectChange('canton', e.target.value)}
          >
            {cantones.map((canton) => (
              <SelectItem key={canton.name} value={canton.name}>
                {canton.name}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="Genero"
            className="w-full"
            placeholder="Genero"
            variant="underlined"
            onChange={(e) => handleSelectChange('gender', e.target.value)}
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
            // Asegúrate de que el valor seleccionado sea un número
            onChange={(e) =>
              handleSelectChange('careerId', parseInt(e.target.value) || 0)
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
            onChange={handleDateChange} // Usa el manejador personalizado aquí
          />
        </div>
        <div className="m-1 w-full flex gap-4 justify-center">
          <Button
            type="submit"
            size="lg"
            className="w-56 m-1 bg-blue-700 text-white"
            radius="sm"
            disabled={formik.isSubmitting}
          >
            Crear
          </Button>
          <Button
            size="lg"
            className="w-56 m-1 bg-red-600 text-white"
            radius="sm"
            disabled={formik.isSubmitting}
            onPress={onClose}
          >
            Close
          </Button>
        </div>
      </form>
    </>
  )
}

export default UpdateStudentForm
