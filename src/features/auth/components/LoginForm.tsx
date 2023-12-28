import { Button, Input } from '@nextui-org/react'
import React from 'react'
import { useAuth } from '../hooks/useAuth'
import FondoFISEI from '../../../../public/bannerfiseicorreos.png'

export const LoginForm = () => {
  const { formik } = useAuth()

  const submitting = formik.isSubmitting

  return (
    <div className="flex h-screen">
      <div
        className="flex-1 bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: `url('${FondoFISEI.src}')`,
        }}
      />
      <div className="flex-1 flex flex-col justify-center items-center gap-4">
        <img
          src="https://fisei.uta.edu.ec/v4.0/images/logo-sitio-fisei-2020.png"
          alt="logo-fisei"
          loading="lazy"
          className="w-64 h-64"
        />
        <form onSubmit={formik.handleSubmit}>
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            variant="underlined"
            placeholder="Ingrese un correo"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errorMessage={
              formik.touched.email && formik.errors.email
                ? formik.errors.email
                : ''
            }
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            variant="underlined"
            placeholder="Ingrese una contraseña"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errorMessage={
              formik.touched.password && formik.errors.password
                ? formik.errors.password
                : ''
            }
          />
          <Button type="submit" size="lg" disabled={submitting}>
            Ingresar
          </Button>
        </form>
      </div>
    </div>
  )
}
