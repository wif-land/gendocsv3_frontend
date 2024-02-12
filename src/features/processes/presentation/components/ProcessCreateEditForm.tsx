import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Unstable_Grid2'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import { useResponsive } from '../../../../shared/hooks/use-responsive'
import {
  RHFAutocomplete,
  RHFSwitch,
  RHFTextField,
} from '../../../../shared/sdk/hook-form'
import FormProvider from '../../../../shared/sdk/hook-form/form-provider'
import { useProcessForm } from '../hooks/useProcessesForm'
import { IProcess } from '../../domain/entities/IProcess'

type Props = {
  currentProcess?: IProcess
}

export const ProcessNewEditForm = ({ currentProcess }: Props) => {
  const mdUp = useResponsive('up', 'md')
  const { functionaries, methods, onSubmit } = useProcessForm(currentProcess)

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
            Información general de la carrera, como nombre, créditos y
            coordinador.
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="Nombre" required />

            <RHFTextField
              name="credits"
              label="Créditos"
              type="number"
              required
            />

            {functionaries && (
              <RHFAutocomplete
                name="coordinator"
                label="Coordinador"
                placeholder="Escribe el nombre del coordinador"
                freeSolo
                options={functionaries!.map(
                  (functionary) =>
                    `${functionary.firstName} ${functionary.secondName} ${functionary.firstLastName} ${functionary.secondLastName} - ${functionary.dni}`,
                )}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => {
                  const {
                    dni,
                    firstName,
                    firstLastName,
                    secondName,
                    secondLastName,
                  } = functionaries.filter(
                    (functionary) =>
                      option ===
                      `${functionary.firstName} ${functionary.secondName} ${functionary.firstLastName} ${functionary.secondLastName} - ${functionary.dni}`,
                  )[0]

                  if (!dni) {
                    return null
                  }

                  return (
                    <li key={dni} {...props}>
                      <Typography variant="body2">
                        {firstName} {secondName} {firstLastName}{' '}
                        {secondLastName}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {dni}
                      </Typography>
                    </li>
                  )
                }}
                renderTags={(selected, getTagProps) =>
                  selected.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={index}
                      label={option}
                      size="small"
                      color="info"
                      variant="soft"
                    />
                  ))
                }
              />
            )}
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
            Títulos que se otorgan al finalizar la carrera, masculino y
            femenino. Asimismo las horas de vinculación y prácticas.
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="menDegree" label="Título Masculino" required />

            <RHFTextField name="womenDegree" label="Título Femenino" required />

            <Divider />

            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField
                name="internshipHours"
                label="Horas de pasantías"
                type="number"
                required
              />
              <RHFTextField
                required
                name="vinculationHours"
                label="Horas de vinculación"
                type="number"
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
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <RHFSwitch name="isActive" label="Carrera activa" />
        </Box>

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {!currentProcess ? 'Crear' : 'Guardar'}
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
