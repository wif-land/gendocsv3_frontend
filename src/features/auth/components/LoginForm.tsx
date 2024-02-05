import React from 'react'
import { useAuth } from '../hooks/useAuth'
import FondoFISEI from '../../../../public/bannerfiseicorreos.png'
import { Button, TextField } from '@mui/material'

export const LoginForm = () => {
  const { formik } = useAuth()

  const submitting = formik.isSubmitting

  return (
    <div className="flex h-screen ">
      <div
        className="flex-1 bg-contain bg-center bg-repeat  "
        style={{
          backgroundImage: `url('${FondoFISEI.src}')`,
        }}
      />
      <div className="flex-1 flex flex-col justify-center items-center">
        <img
          src="https://fisei.uta.edu.ec/v4.0/images/logo-sitio-fisei-2020.png"
          alt="logo-fisei"
          loading="lazy"
          className="w-4/6 h-auto pb-12 "
        />

        <form
          onSubmit={formik.handleSubmit}
          className="w-1/2 justify-items-center pl-16 pb-32"
        >
          <div className="grid w-6/6 justify-items-center ">
            <TextField
              id="email"
              name="email"
              type="email"
              placeholder="Ingrese un correo"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              className="w-full"
            />
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Ingrese una contraseña"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
            />

            <Button variant="text" disabled={submitting} type="submit">
              Ingresar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
