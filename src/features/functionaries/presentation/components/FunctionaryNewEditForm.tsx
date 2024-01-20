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
  RHFSwitch,
  RHFTextField,
} from '../../../../shared/components/hook-form'
import FormProvider from '../../../../shared/components/hook-form/form-provider'
import { IFunctionary } from '../../domain/entities/IFunctionary'
import { useFunctionaryForm } from '../hooks/useFunctionaryForm'

type Props = {
  currentFunctionary?: IFunctionary
}

export const FunctionaryNewEditForm = ({ currentFunctionary }: Props) => {
  const mdUp = useResponsive('up', 'md')
  const { methods, onSubmit } = useFunctionaryForm(currentFunctionary)

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Detalles
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Información general del funcionario, nombre, apellidos, cédula, etc.
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Detalles" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="dni" label="Cédula de identidad" required />

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
                name="personalEmail"
                label="Correo personal"
                type="email"
                required
              />

              <RHFTextField
                name="phoneNumber"
                label="Número de celular"
                required
              />

              <RHFTextField
                name="regularPhoneNumber"
                label="Teléfono fijo"
                required
              />
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  )

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Títulos
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Títulos de segundo, tercer y cuarto nivel conseguido por el
            funcionario
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="secondLevelDegree"
              label="Título de segundo nivel"
              required
            />

            <RHFTextField
              name="thirdLevelDegree"
              label="Título de tercer nivel"
              required
            />

            <RHFTextField
              name="fourthLevelDegree"
              label="Título de cuarto nivel"
              required
            />
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
          <RHFSwitch name="isActive" label="Funcionario activo" />
        </Box>

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {!currentFunctionary ? 'Crear' : 'Guardar'}
        </LoadingButton>
      </Grid>
    </>
  )

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderProperties}

        {renderActions}
      </Grid>
    </FormProvider>
  )
}
