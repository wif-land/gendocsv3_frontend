'use client'

import * as Yup from 'yup'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import LoadingButton from '@mui/lab/LoadingButton'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { RHFTextField } from '../../../../shared/sdk/hook-form'
import Iconify from '../../../../core/iconify'
import { RouterLink } from '../../../../core/routes/components'
import PasswordIcon from '../../../../shared/assets/icons/password-icon'
import FormProvider from '../../../../shared/sdk/hook-form/form-provider'
import { Box } from '@mui/material'

type FormValuesProps = {
  email: string
}

export const ModernForgotPasswordView = () => {
  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email is required')
      .email('Email must be a valid email address'),
  })

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: {
      email: '',
    },
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
      alignItems="center"
      justifyContent="center"
      style={{ maxHeight: '100vh' }}
    >
      <RHFTextField name="email" label="Correo electrónico" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
        sx={{ justifyContent: 'space-between', pl: 2, pr: 1.5 }}
      >
        Enviar
      </LoadingButton>

      <Link
        component={RouterLink}
        href={'/login'}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        Volver al inicio de sesión
      </Link>
    </Stack>
  )

  const renderHead = (
    <>
      <PasswordIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h3">¿Ha olvidado su contraseña?</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Por favor, ingrese su dirección de correo electrónico para recibir un
          enlace de restablecimiento de contraseña.
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
