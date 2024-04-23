/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
import LoadingButton from '@mui/lab/LoadingButton'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Unstable_Grid2'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import { useResponsive } from '../../../../shared/hooks/use-responsive'
import {
  RHFAutocomplete,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
} from '../../../../shared/sdk/hook-form'
import FormProvider from '../../../../shared/sdk/hook-form/form-provider'
import { Controller } from 'react-hook-form'
import { COUNCIL_TYPES, ICouncil } from '../../domain/entities/ICouncil'
import { MobileDateTimePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { Box, MenuItem } from '@mui/material'
import { useCouncilsForm } from '../hooks/useCouncilsForm'

type Props = {
  currentCouncil?: ICouncil
}

export const CouncilNewEditForm = ({ currentCouncil }: Props) => {
  const mdUp = useResponsive('up', 'md')
  const {
    methods,
    unusedFunctionaries,
    onSubmit,
    setSearchField,
    loading,
    defaultMembers,
  } = useCouncilsForm(currentCouncil)
  const { handleSubmit, control, watch } = methods

  console.log(watch().members)

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

            <RHFSelect
              name="type"
              label="Tipo"
              InputLabelProps={{ shrink: true }}
            >
              {COUNCIL_TYPES.map((council) => (
                <MenuItem key={council.value} value={council.value}>
                  {council.label}
                </MenuItem>
              ))}
            </RHFSelect>

            <Controller
              name="date"
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <MobileDateTimePicker
                  {...field}
                  value={dayjs(field.value)}
                  onChange={(newValue) => {
                    if (newValue) {
                      field.onChange(newValue)
                    }
                  }}
                  label="Fecha y hora de ejecución"
                  format="dddd/MM/YYYY hh:mm a"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              )}
            />
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
            Puedes elegir entre los miembros representantes por defecto o en su
            defecto elegir arbitrariamente a los miembros
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            {defaultMembers &&
              defaultMembers.map((member, index) => (
                <RHFAutocomplete
                  key={member.id}
                  name={`members[${index}]`}
                  label={member.positionName}
                  placeholder="Escribe el nombre o cédula del miembro deseado"
                  freeSolo
                  loading={loading.value}
                  onClose={() => {
                    setSearchField('')
                  }}
                  noOptionsText="No hay resultados"
                  onInputChange={(_event, newInputValue) => {
                    setSearchField(newInputValue)
                  }}
                  options={unusedFunctionaries!.map((functionary) => ({
                    id: functionary.id,
                    label: `${functionary.firstName} ${functionary.secondName} ${functionary.firstLastName} ${functionary.secondLastName} - ${functionary.dni}`,
                    positionName: member.positionName,
                    positionOrder: member.positionOrder,
                    isStudent: member.isStudent,
                  }))}
                />
              ))}

            {/* <RHFAutocomplete
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
            /> */}

            {/*
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
              ))} */}
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
          <RHFSwitch name="isActive" label="Consejo activo" />
        </Box>

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          disabled={loading.value}
        >
          {!currentCouncil ? 'Crear' : 'Guardar'}
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
