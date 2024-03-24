/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
import LoadingButton from '@mui/lab/LoadingButton'
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
import { Box, Chip, IconButton, Tooltip, alpha } from '@mui/material'
import Iconify from '../../../../core/iconify'
import { DocumentModel } from '../../data/models/DocumentsModel'
import { useDocumentsForm } from '../hooks/useDocumentsForm'

type Props = {
  currentDocument?: DocumentModel
}

export const DocumentNewEditForm = ({ currentDocument }: Props) => {
  const mdUp = useResponsive('up', 'md')
  const {
    methods,
    unusedFunctionaries,
    handleAddAttendees,
    handleRemoveAttendee,
    setSearchField,
    loading,
    onSubmit,
  } = useDocumentsForm(currentDocument)

  const { handleSubmit, watch } = methods

  const values = watch()

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Detalles
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            El nombre del consejo, tipo, fecha y hora de inicio. Y si está
            activo o no
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="Nombre" required />
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
            Miembros
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Se elijen a los miembros del consejo
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFAutocomplete
              name="president"
              label="Presidente"
              placeholder="Escribe el nombre del presidente del consejo"
              freeSolo
              open={isOpenPresident.value}
              loading={loading.value}
              onOpen={handleOpenPresident}
              onClose={() => {
                handleClosePresident()
                setSearchField('')
              }}
              noOptionsText="No hay resultados"
              onInputChange={(_event, newInputValue) => {
                setSearchField(newInputValue)
              }}
              options={unusedFunctionaries?.map(
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
                } = unusedFunctionaries.filter(
                  (functionary) =>
                    option ===
                    `${functionary.firstName} ${functionary.secondName} ${functionary.firstLastName} ${functionary.secondLastName} - ${functionary.dni}`,
                )[0]

                if (!dni) {
                  return null
                }

                return (
                  <li {...props} key={dni}>
                    <Typography variant="body2">
                      {firstName} {secondName} {firstLastName} {secondLastName}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {dni}
                    </Typography>
                  </li>
                )
              }}
            />

            <RHFAutocomplete
              name="subrogant"
              label="Subrogante"
              placeholder="Escribe el nombre del subrogante"
              freeSolo
              noOptionsText="No hay resultados"
              open={isOpenSubrogant.value}
              loading={loading.value}
              onOpen={handleOpenSubrogant}
              onClose={() => {
                handleCloseSubrogant()
                setSearchField('')
              }}
              options={unusedFunctionaries!.map(
                (functionary) =>
                  `${functionary.firstName} ${functionary.secondName} ${functionary.firstLastName} ${functionary.secondLastName} - ${functionary.dni}`,
              )}
              onInputChange={(event, newInputValue) => {
                setSearchField(newInputValue)
              }}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => {
                const {
                  dni,
                  firstName,
                  firstLastName,
                  secondName,
                  secondLastName,
                } = unusedFunctionaries.filter(
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
                      {firstName} {secondName} {firstLastName} {secondLastName}
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
                    key={option}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            />

            <Divider sx={{ borderStyle: 'dashed' }} />

            {values.attendees &&
              unusedFunctionaries &&
              values.attendees.map((attendee, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                  <RHFAutocomplete
                    sx={{ flexGrow: 1 }}
                    name={`attendees[${index}]`}
                    label={`Miembro ${index + 1}`}
                    placeholder="Escribe el nombre del miembro"
                    freeSolo
                    options={unusedFunctionaries!.map(
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
                      } = unusedFunctionaries!.filter(
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
                  />

                  <IconButton onClick={() => handleRemoveAttendee(index)}>
                    <Iconify icon="fluent:delete-20-regular" />
                  </IconButton>
                </Box>
              ))}

            <Stack
              direction="row"
              flexWrap="wrap"
              alignItems="center"
              spacing={1}
            >
              <Tooltip title="Añadir miembro">
                <IconButton
                  onClick={handleAddAttendees}
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                    border: (theme) => `dashed 1px ${theme.palette.divider}`,
                  }}
                >
                  <Iconify icon="mingcute:add-line" />
                </IconButton>
              </Tooltip>
            </Stack>
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
        sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <RHFSwitch name="isActive" label="Documento activo" />
        </Box>

        <LoadingButton type="submit" variant="contained" size="large">
          {!currentDocument ? 'Crear' : 'Guardar'}
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
