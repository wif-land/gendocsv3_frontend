import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Grid, IconButton, InputAdornment } from '@mui/material'
import FormProvider from '../../../../shared/sdk/hook-form/form-provider'
import { RHFTextField } from '../../../../shared/sdk/hook-form'
import LoadingButton from '@mui/lab/LoadingButton'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import Iconify from '../../../../core/iconify'
import Link from '@mui/material/Link'
import { useRouter } from 'next/navigation'

export const LoginForm = () => {
  const { methods, onSubmit } = useAuth()
  const password = useBoolean()
  const router = useRouter()

  const { handleSubmit } = methods

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <RHFTextField name="email" label="Correo electrónico" required />
        </Grid>

        <Grid item xs={12}>
          <RHFTextField
            name="password"
            label="Password"
            type={password.value ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={password.onToggle} edge="end">
                    <Iconify
                      icon={
                        password.value
                          ? 'solar:eye-bold'
                          : 'solar:eye-closed-bold'
                      }
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <LoadingButton
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            loading={methods.formState.isSubmitting}
          >
            Ingresar
          </LoadingButton>

          <Link
            variant="body2"
            align="center"
            mt={2}
            onClick={() => {
              router.push('/auth/forgot-password')
            }}
            color="inherit"
            underline="always"
            sx={{ alignSelf: 'flex-end', cursor: 'pointer' }}
          >
            Reestablecer contraseña
          </Link>
        </Grid>
      </Grid>
    </FormProvider>
  )
}
