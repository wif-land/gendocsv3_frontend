import React, { useEffect, useState } from 'react'
import cantones from '../data/canton'
import { formatISO } from 'date-fns'

import { Button, Input, Select, SelectItem, Switch } from '@nextui-org/react'
import { useUpdateStudent } from '../hooks/useUpdateStudent'
import { ICareer } from '../../careers/types/ICareer'
import { CareersApi } from '../../careers/api/carers'
import { IStudent } from '../types/IStudent'

const UpdateStudentForm = ({
  student,
  onClose,
}: {
  student: IStudent
  onClose: () => void
}) => {
  const { formik, setStudentId } = useUpdateStudent()
  const [careers, setCareers] = useState<ICareer[]>([])

  const genders = [
    {
      defaultValue: 'M',
      label: 'Masculino',
    },
    {
      defaultValue: 'F',
      label: 'Femenino',
    },
  ]

  const handleSelectChange = (name, value) => {
    const numericValue = !isNaN(value) ? Number(value) : value
    formik.setFieldValue(name, numericValue)
  }

  const handleDateChange = (e) => {
    const { name, defaultValue } = e.target
    const formattedDate = formatISO(new Date(defaultValue))
    formik.setFieldValue(name, formattedDate)
  }

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

  useEffect(() => {
    let isMounted = true

    const handleSetStudent = () => {
      if (isMounted) {
        setStudentId(student.id)
      }
    }

    handleSetStudent()

    return () => {
      isMounted = false
    }
  }, [student])

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
            defaultValue={student.dni}
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
            defaultValue={student.firstName}
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
            defaultValue={student.secondName}
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
            defaultValue={student.firstLastName}
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
            defaultValue={student.secondLastName}
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
            defaultValue={student.personalEmail}
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
            defaultValue={student.outlookEmail}
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
            defaultValue={student.regularPhoneNumber}
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
            defaultValue={student.phoneNumber}
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
            defaultValue={student.registration}
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
            defaultValue={student.folio}
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
            defaultValue={student.approvedCredits.toString()}
            onChange={(e) =>
              formik.setFieldValue(
                'approvedCredits',
                parseInt(e.target.defaultValue) || 0,
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
            defaultSelectedKeys={[student.canton]}
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
            defaultSelectedKeys={student.gender || []}
          >
            {genders.map((gender) => (
              <SelectItem key={gender.defaultValue} value={gender.defaultValue}>
                {gender.label}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="Carrera"
            className="w-full"
            placeholder="Carrera"
            variant="underlined"
            defaultSelectedKeys={[student.career?.id?.toString() || '']}
            onChange={(e) =>
              handleSelectChange('careerId', parseInt(e.target.value) || 0)
            }
          >
            {careers.map((career) => (
              <SelectItem key={career.id} value={career.id.toString()}>
                {career.name}
              </SelectItem>
            ))}
          </Select>

          <input
            type="date"
            id="birthdate"
            name="birthdate"
            onChange={handleDateChange}
            defaultValue={
              student.birthdate ? student.birthdate.split('T')[0] : ''
            }
          />
          <Switch
            id="isActive"
            name="isActive"
            size="sm"
            className="m-1"
            onValueChange={(defaultValue) => {
              const fakeEvent = {
                target: {
                  name: 'isActive',
                  defaultValue,
                },
              }
              formik.handleChange(fakeEvent)
            }}
            defaultChecked={student.isActive}
          >
            Estudiante Activo
          </Switch>
        </div>
        <div className="m-2 w-full flex gap-4 justify-center">
          <Button
            type="submit"
            size="lg"
            className="w-56 m-1 bg-blue-700 text-white"
            radius="sm"
            disabled={formik.isSubmitting}
            onClick={onClose}
          >
            Actualizar
          </Button>
          <Button
            type="reset"
            size="lg"
            className="w-56 m-1 bg-red-600 text-white"
            radius="sm"
            disabled={formik.isSubmitting}
            onClick={onClose}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </>
  )
}

export default UpdateStudentForm
