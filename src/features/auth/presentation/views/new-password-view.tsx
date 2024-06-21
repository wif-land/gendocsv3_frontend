'use client'

import * as Yup from 'yup'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import LoadingButton from '@mui/lab/LoadingButton'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { RHFCode, RHFTextField } from '../../../../shared/sdk/hook-form'
import Iconify from '../../../../core/iconify'
import SentIcon from '../../../../shared/assets/icons/sent-icon'
import FormProvider from '../../../../shared/sdk/hook-form/form-provider'
import { useRouter } from 'next/navigation'
import { Box } from '@mui/material'

type FormValuesProps = {
  code: string
  email: string
  password: string
  confirmPassword: string
}

export default () => {
  const password = useBoolean()
  const router = useRouter()

  const NewPasswordSchema = Yup.object().shape({
    code: Yup.string()
      .min(6, 'Code must be at least 6 characters')
      .required('Code is required'),
    email: Yup.string()
      .required('Email is required')
      .email('Email must be a valid email address'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
  })

  const defaultValues = {
    code: '',
    email: '',
    password: '',
    confirmPassword: '',
  }

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(NewPasswordSchema),
    defaultValues,
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const onSubmit = useCallback(async (data: FormValuesProps) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      console.info('DATA', data)
    } catch (error) {
      console.error(error)
    }
  }, [])

  const renderForm = (
    <Stack
      spacing={3}
      sx={{
        maxWidth: '500px',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <RHFTextField name="email" label="Correo Electrónico" />

      <RHFCode name="code" />

      <RHFTextField
        name="password"
        label="Nueva Contraseña"
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify
                  icon={
                    password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'
                  }
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <RHFTextField
        name="confirmPassword"
        label="Confirmar Nueva Contraseña"
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify
                  icon={
                    password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'
                  }
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Cambiar Contraseña
      </LoadingButton>

      <Typography variant="body2">
        ¿No recibiste el código de verificación? &nbsp;
        <Link
          variant="subtitle2"
          sx={{
            cursor: 'pointer',
          }}
        >
          Reenviar código
        </Link>
      </Typography>

      <Link
        onClick={() => {
          router.push('/login')
        }}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
          cursor: 'pointer',
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        Regresar al inicio de sesión
      </Link>
    </Stack>
  )

  const renderHead = (
    <>
      <SentIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h3">Petición enviada correctamente!</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Hemos enviado un código de verificación a tu correo electrónico.
          <br />
          Por favor, ingresa el código y tu nueva contraseña para continuar.
        </Typography>
      </Stack>
    </>
  )

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        {renderHead}

        {renderForm}
      </FormProvider>
    </Box>
  )
}
