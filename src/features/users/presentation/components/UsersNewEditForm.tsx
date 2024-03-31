import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Unstable_Grid2'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

import { useResponsive } from '../../../../shared/hooks/use-responsive'
import {
  RHFMultiSelect,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
} from '../../../../shared/sdk/hook-form'
import FormProvider from '../../../../shared/sdk/hook-form/form-provider'

import { useUsersForm } from '../hooks/useUsersForm'
import { IUser, UserRole, UserTypeLabels } from '../../domain/entities/IUser'
import { MenuItem } from '@mui/material'
import useModulesStore from '../../../../shared/store/modulesStore'

type Props = {
  currentUser?: IUser
}

export const UsersNewEditForm = ({ currentUser }: Props) => {
  const mdUp = useResponsive('up', 'md')
  const { methods, onSubmit } = useUsersForm(currentUser)
  const { modules } = useModulesStore()

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = methods

  const selectedModules = watch('accessModules')

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Detalles
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Información general del usuario, nombre, apellidos, etc.
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Detalles" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              sx={{
                columnGap: 2,
                rowGap: 3,
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  md: 'repeat(2, 1fr)',
                },
              }}
            >
              <RHFTextField name="firstName" label="Primer nombre" required />

              <RHFTextField name="secondName" label="Segundo nombre" />

              <RHFTextField
                name="firstLastName"
                label="Primer apellido"
                required
              />

              <RHFTextField name="secondLastName" label="Segundo apellido" />
            </Box>

            <Divider />

            <Box
              sx={{
                columnGap: 2,
                rowGap: 3,
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  md: 'repeat(2, 1fr)',
                },
              }}
            >
              <RHFTextField
                name="outlookEmail"
                label="Correo institucional"
                type="email"
                required
              />

              <RHFTextField
                name="googleEmail"
                label="Correo personal"
                type="email"
                required
              />
            </Box>
            <Box
              sx={{
                columnGap: 2,
                rowGap: 3,
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  md: 'repeat(2, 1fr)',
                },
              }}
            >
              <RHFTextField name="password" label="Contraseña" type="text" />

              <RHFSelect name="role" label="Rol" required>
                {Object.values(UserRole).map((role) => (
                  <MenuItem value={role}>{UserTypeLabels[role]}</MenuItem>
                ))}
              </RHFSelect>
              <Divider />
            </Box>

            <Box
              sx={{
                columnGap: 2,
                rowGap: 3,
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  md: 'repeat(2, 1fr)',
                },
              }}
            >
              <RHFMultiSelect
                name="accessModules"
                label="Módulos de acceso"
                required
                options={modules!.map((module) => ({
                  label: module.name,
                  value: module.id.toString(),
                }))}
                value={selectedModules.map((id) => id.toString())}
              />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Módulos seleccionados:
                </Typography>
                {selectedModules
                  ?.map((moduleId) => {
                    const module = modules!.find(
                      (m) => m.id.toString() === moduleId.toString(),
                    )
                    return module ? module.name : null
                  })
                  .filter(Boolean)
                  .join(', ')}
              </Typography>
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  )

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <RHFSwitch name="isActive" label="Usuario activo" />
        </Box>

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {!currentUser ? 'Crear' : 'Guardar'}
        </LoadingButton>
      </Grid>
    </>
  )

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderActions}
      </Grid>
    </FormProvider>
  )
}
