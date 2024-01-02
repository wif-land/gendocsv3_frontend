import React from 'react'
import { useStudent } from '../hooks/useStudent'
import { Input } from '@nextui-org/react'

const addStudentForm = () => {
  const { formik } = useStudent()
  return (
    <>
      <div className="flex h-screen ">
        <div className="flex-1 flex flex-col justify-center items-center">
          <form
            onSubmit={formik.handleSubmit}
            className="w-1/2 justify-items-center pl-16 pb-32"
          >
            <div className="grid w-6/6 justify-items-center ">
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
                  formik.touched.dni && formik.errors.dni
                    ? formik.errors.dni
                    : ''
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
                id="lastName"
                name="lastName"
                type="lastName"
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
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default addStudentForm
