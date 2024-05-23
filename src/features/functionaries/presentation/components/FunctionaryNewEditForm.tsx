import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Unstable_Grid2'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

import { useResponsive } from '../../../../shared/hooks/use-responsive'
import { RHFSwitch, RHFTextField } from '../../../../shared/sdk/hook-form'
import FormProvider from '../../../../shared/sdk/hook-form/form-provider'
import { Button, MenuItem } from '@mui/material'

import { IFunctionary } from '../../domain/entities/IFunctionary'
import { useFunctionaryForm } from '../hooks/useFunctionaryForm'
import { RHFSelect } from '../../../../shared/sdk/hook-form/rhf-select'
import { useDegreeData } from '../../../../core/providers/functionary-degree-provider'
import { useRouter } from 'next/navigation'

type Props = {
  currentFunctionary?: IFunctionary
}

export const FunctionaryNewEditForm = ({ currentFunctionary }: Props) => {
  const mdUp = useResponsive('up', 'md')
  const router = useRouter()

  const { methods, onSubmit } = useFunctionaryForm(currentFunctionary)
  const { degrees } = useDegreeData()

  const thirdLevelDegree = degrees.filter(
    (degree) => degree.degreeLevel === '3',
  )

  const fourthLevelDegree = degrees.filter(
    (degree) => degree.degreeLevel === '4',
  )

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
            <RHFTextField
              name="dni"
              type="tel"
              label="Cédula de identidad"
              required
              inputProps={{
                maxLength: 10,
              }}
            />

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
                name="firstName"
                label="Primer nombre"
                required
                inputProps={{
                  maxLength: 50,
                }}
              />

              <RHFTextField
                name="secondName"
                label="Segundo nombre"
                required
                inputProps={{
                  maxLength: 50,
                }}
              />

              <RHFTextField
                name="firstLastName"
                label="Primer apellido"
                required
                inputProps={{
                  maxLength: 50,
                }}
              />

              <RHFTextField
                name="secondLastName"
                label="Segundo apellido"
                required
                inputProps={{
                  maxLength: 50,
                }}
              />
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
                type="tel"
                label="Número de celular"
                required
                inputMode="tel"
                inputProps={{
                  maxLength: 10,
                }}
              />

              <RHFTextField
                name="regularPhoneNumber"
                type="tel"
                label="Teléfono fijo"
                required
                inputMode="tel"
                inputProps={{
                  maxLength: 10,
                }}
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
            Títulos de tercer y cuarto nivel conseguido por el funcionario
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFSelect name="thirdLevelDegree" label="Título de tercer nivel">
              {thirdLevelDegree.map((degree) => (
                <MenuItem key={degree.id} value={degree.id}>
                  {degree.maleTitle}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFSelect
              id="fourthLevelDegree"
              name="fourthLevelDegree"
              label="Título de cuarto nivel"
            >
              {fourthLevelDegree.map((degree) => (
                <MenuItem key={degree.id} value={degree.id}>
                  {degree.maleTitle}
                </MenuItem>
              ))}
            </RHFSelect>
          </Stack>
        </Card>
      </Grid>
    </>
  )

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid
        xs={12}
        md={8}
        sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <RHFSwitch name="isActive" label="Funcionario activo" />
        </Box>

        <Button
          variant="outlined"
          size="large"
          onClick={() => {
            methods.reset()
            router.back()
          }}
        >
          Cancelar
        </Button>

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
