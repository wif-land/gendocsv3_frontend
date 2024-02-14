import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Unstable_Grid2'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

import { useResponsive } from '../../../../shared/hooks/use-responsive'
import { RHFSelect, RHFTextField } from '../../../../shared/sdk/hook-form'
import FormProvider from '../../../../shared/sdk/hook-form/form-provider'

import { IStudent } from '../../types/IStudent'
import { useStudentForm } from '../hooks/useStudentForm'
import { CANTONES, GENDERS } from '../constants'
import { MenuItem } from '@mui/material'
import { Controller } from 'react-hook-form'
import { MobileDatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'

type Props = {
  currentStudent?: IStudent
}

export const StudentNewEditForm = ({ currentStudent }: Props) => {
  const mdUp = useResponsive('up', 'md')
  const { methods, onSubmit, careers } = useStudentForm(currentStudent)
  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = methods

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Información general
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Información general del estudiante como, nombres, apellidos, cédula,
            carrera, folio, matrícula, etc.
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
              {!!careers.length && (
                <RHFSelect name="career" label="Carrera">
                  {careers.map((career) => (
                    <MenuItem key={career.id} value={career.id}>
                      {career.name}
                    </MenuItem>
                  ))}
                </RHFSelect>
              )}

              <RHFTextField name="approvedCredits" label="Créditos aprobados" />

              <RHFTextField name="folio" label="Folio" required />

              <RHFTextField name="registration" label="Matrícula" />
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  )

  const renderContactInfo = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Información de contacto
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Información de contacto del estudiante como, correo, teléfono, etc.
          </Typography>
        </Grid>
      )}
      <Grid xs={12} md={8}>
        <Card>
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

  const renderDemographics = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Información demográfica
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Fecha de nacimiento, género, cantón, etc.
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}
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
              <RHFSelect name="gender" label="Género">
                {GENDERS.map((option) => (
                  <MenuItem key={option.value} value={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect name="canton" label="Cantón de residencia">
                {CANTONES.map((option) => (
                  <MenuItem key={option.value} value={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              <Controller
                name="birthdate"
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <MobileDatePicker
                    {...field}
                    value={dayjs(field.value)}
                    onChange={(newValue) => {
                      if (newValue) {
                        field.onChange(newValue)
                      }
                    }}
                    label="Fecha de nacimiento"
                    format="dddd/MM/YYYY"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                      },
                    }}
                    disableFuture
                  />
                )}
              />
            </Box>
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
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}
      >
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {!currentStudent ? 'Crear' : 'Guardar'}
        </LoadingButton>
      </Grid>
    </>
  )

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderContactInfo}

        {renderDemographics}

        {renderActions}
      </Grid>
    </FormProvider>
  )
}
