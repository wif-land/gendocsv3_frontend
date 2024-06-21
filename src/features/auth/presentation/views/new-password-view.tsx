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
import { RHFTextField } from '../../../../shared/sdk/hook-form'
import Iconify from '../../../../core/iconify'
import SentIcon from '../../../../shared/assets/icons/sent-icon'
import FormProvider from '../../../../shared/sdk/hook-form/form-provider'
import { useRouter } from 'next/navigation'
import { Box } from '@mui/material'
import { NewPasswordUseCase } from '../../domain/usecases/newPasswordUseCase'

type FormValuesProps = {
  email: string
  password: string
  confirmPassword: string
}

export default () => {
  const password = useBoolean()
  const router = useRouter()

  const NewPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .required('Correo electrónico es requerido')
      .matches(/^[A-Z0-9._%+-]+@uta\.edu\.ec$/i, `Debe contener (uta.edu.ec)`)
      .email('Correo electrónico debe ser una dirección de correo válida'),
    password: Yup.string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .required('Contraseña es requerida'),
    confirmPassword: Yup.string()
      .required('Confirmar contraseña es requerida')
      .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden'),
  })

  const defaultValues = {
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
    await new NewPasswordUseCase().call({
      email: data.email,
      password: data.password,
    })

    router.push('/login')
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
        <Typography variant="h3">¡Petición enviada correctamente!</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Ingresa tu nueva contraseña para continuar
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
