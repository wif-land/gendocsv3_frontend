import React from 'react'
import { useFunctionary } from '../hooks/useFunctionary'
import { Input } from '@nextui-org/react'

const FunctionaryForm = () => {
  const { formik } = useFunctionary()

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
                id="firstLastName"
                name="firstLastName"
                type="firstLastName"
                label="Primer Apellido"
                variant="underlined"
                placeholder="Ingrese un primer apellido"
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
                id="outlookEmail"
                name="outlookEmail"
                type="outlookEmail"
                label="Correo Outlook"
                variant="underlined"
                placeholder="Ingrese un correo Outlook"
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
                id="googleEmail"
                name="googleEmail"
                type="googleEmail"
                label="Correo Google"
                variant="underlined"
                placeholder="Ingrese un correo Google"
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
                id="phoneNumber"
                name="phoneNumber"
                type="phoneNumber"
                label="Número de Teléfono"
                variant="underlined"
                placeholder="Ingrese un número de teléfono"
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
                id="regularPhoneNumber"
                name="regularPhoneNumber"
                type="regularPhoneNumber"
                label="Número de Teléfono Convencional"
                variant="underlined"
                placeholder="Ingrese un número de teléfono convencional"
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
                id="secondLevelDegree"
                name="secondLevelDegree"
                type="secondLevelDegree"
                label="Título de Segundo Nivel"
                variant="underlined"
                placeholder="Ingrese un título de segundo nivel"
                value={formik.values.secondLevelDegree}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                size="lg"
                errorMessage={
                  formik.touched.secondLevelDegree &&
                  formik.errors.secondLevelDegree
                    ? formik.errors.secondLevelDegree
                    : ''
                }
                className="w-full"
              />
              <Input
                id="thirdLevelDegree"
                name="thirdLevelDegree"
                type="thirdLevelDegree"
                label="Título de Tercer Nivel"
                variant="underlined"
                placeholder="Ingrese un título de tercer nivel"
                value={formik.values.thirdLevelDegree}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                size="lg"
                errorMessage={
                  formik.touched.thirdLevelDegree &&
                  formik.errors.thirdLevelDegree
                    ? formik.errors.thirdLevelDegree
                    : ''
                }
                className="w-full"
              />
              <Input
                id="forthLevelDegree"
                name="forthLevelDegree"
                type="forthLevelDegree"
                label="Título de Cuarto Nivel"
                variant="underlined"
                placeholder="Ingrese un título de cuarto nivel"
                value={formik.values.forthLevelDegree}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                size="lg"
                errorMessage={
                  formik.touched.forthLevelDegree &&
                  formik.errors.forthLevelDegree
                    ? formik.errors.forthLevelDegree
                    : ''
                }
                className="w-full"
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default FunctionaryForm
