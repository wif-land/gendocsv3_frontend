import React, { useEffect } from 'react'
import { Button, Input, Switch } from '@nextui-org/react'
import { IFunctionary } from '../types/IFunctionary'
import { useUpdateFunctionary } from '../hooks/useUpdateFunctionary'

const UpdateFunctionaryForm = ({
  functionary,
  onClose,
}: {
  functionary: IFunctionary
  onClose: () => void
}) => {
  const { formik, setFunctionaryId } = useUpdateFunctionary()

  useEffect(() => {
    setFunctionaryId(functionary.id!)
  }, [])

  return (
    <>
      <form onSubmit={formik.handleSubmit} className=" justify-items-center ">
        <div className="grid grid-cols-2 gap-8 w-6/6 justify-items-center ">
          <Input
            id="dni"
            name="dni"
            type="dni"
            label="DNI"
            variant="underlined"
            placeholder="Ingrese un DNI"
            value={functionary.dni}
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
            defaultValue={functionary.firstName}
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
            defaultValue={functionary.secondName}
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
            defaultValue={functionary.firstLastName}
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
            defaultValue={functionary.secondLastName}
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
            defaultValue={functionary.outlookEmail}
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
            id="personalEmail"
            name="personalEmail"
            type="personalEmail"
            label="Correo Google"
            variant="underlined"
            placeholder="Ingrese un correo Google"
            defaultValue={functionary.personalEmail}
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
            id="phoneNumber"
            name="phoneNumber"
            type="phoneNumber"
            label="Número de Teléfono"
            variant="underlined"
            placeholder="Ingrese un número de teléfono"
            defaultValue={functionary.phoneNumber}
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
            defaultValue={functionary.regularPhoneNumber}
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
            defaultValue={functionary.secondLevelDegree}
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
            defaultValue={functionary.thirdLevelDegree}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            size="lg"
            errorMessage={
              formik.touched.thirdLevelDegree && formik.errors.thirdLevelDegree
                ? formik.errors.thirdLevelDegree
                : ''
            }
            className="w-full"
          />
          <Input
            id="fourthLevelDegree"
            name="fourthLevelDegree"
            type="fourthLevelDegree"
            label="Título de Cuarto Nivel"
            variant="underlined"
            placeholder="Ingrese un título de cuarto nivel"
            defaultValue={functionary.fourthLevelDegree}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            size="lg"
            errorMessage={
              formik.touched.fourthLevelDegree &&
              formik.errors.fourthLevelDegree
                ? formik.errors.fourthLevelDegree
                : ''
            }
            className="w-full"
          />
        </div>
        <Switch
          id="isActive"
          name="isActive"
          size="sm"
          className="m-4"
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
        <div className="flex justify-center m-4">
          <Button
            type="submit"
            size="lg"
            className="w-56 m-1 bg-blue-600 text-white"
            radius="sm"
            disabled={formik.isSubmitting}
            onPress={onClose}
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

export default UpdateFunctionaryForm
