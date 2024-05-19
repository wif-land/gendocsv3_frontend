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

import { useStudentForm } from '../hooks/useStudentForm'

import { Button, MenuItem } from '@mui/material'
import { Controller } from 'react-hook-form'
import { MobileDatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'

import { IStudent } from '../../domain/entities/IStudent'
import { useLocations } from '../../../../core/providers/locations-provider'
import { GENDERS } from '../constants'
import { useRouter } from 'next/navigation'

type Props = {
  currentStudent?: IStudent
}

export const StudentNewEditForm = ({ currentStudent }: Props) => {
  const mdUp = useResponsive('up', 'md')
  const router = useRouter()

  const { cities } = useLocations()
  const { methods, onSubmit, careers } = useStudentForm(currentStudent)
  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = methods

  const renderGeneralInfo = (
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
          </Stack>
        </Card>
      </Grid>
    </>
  )

  const renderDegreeInfo = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Información de grado
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Información de grado del estudiante como, carrera, créditos, etc.
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
              {!!careers?.length && (
                <RHFSelect name="career" label="Carrera">
                  {careers.map((career) => (
                    <MenuItem key={career.id} value={career.id}>
                      {career.name}
                    </MenuItem>
                  ))}
                </RHFSelect>
              )}

              <RHFTextField
                name="approvedCredits"
                label="Créditos aprobados"
                required
                type="number"
              />

              <RHFTextField
                name="vinculationHours"
                label="Horas de vinculación"
                type="number"
              />

              <RHFTextField
                name="internshipHours"
                label="Horas de pasantía"
                type="number"
              />

              <Controller
                name="startStudiesDate"
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
                    label="Fecha de inicio de estudios"
                    format="dddd/MM/YYYY"
                    minDate={dayjs().subtract(50, 'year')}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                    closeOnSelect
                  />
                )}
              />

              <Controller
                name="endStudiesDate"
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
                    label="Fecha de fin de estudios"
                    format="dddd/MM/YYYY"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                    minDate={dayjs().subtract(45, 'year')}
                    closeOnSelect
                  />
                )}
              />

              <RHFTextField
                name="bachelorDegree"
                label="Título de Bachillerato"
                required
                inputProps={{
                  maxLength: 100,
                }}
              />

              <RHFTextField
                name="folio"
                label="Folio"
                required
                inputProps={{
                  maxLength: 50,
                }}
              />

              <RHFTextField
                name="registration"
                label="Matrícula"
                required
                inputProps={{
                  maxLength: 50,
                }}
              />
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
                type="tel"
                required
                inputProps={{
                  maxLength: 10,
                }}
              />

              <RHFTextField
                name="regularPhoneNumber"
                label="Teléfono fijo"
                type="tel"
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
                {cities.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
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
                    maxDate={dayjs().subtract(18, 'year')}
                    minDate={dayjs().subtract(100, 'year')}
                    closeOnSelect
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
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'end',
          gap: '10px',
        }}
      >
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
          {!currentStudent ? 'Crear' : 'Guardar'}
        </LoadingButton>
      </Grid>
    </>
  )

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {renderGeneralInfo}

        {renderDegreeInfo}

        {renderContactInfo}

        {renderDemographics}

        {renderActions}
      </Grid>
    </FormProvider>
  )
}
