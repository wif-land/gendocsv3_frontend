import { Button, Card, Grid, MenuItem, Stack } from '@mui/material'
import FormProvider from '../../../../shared/sdk/hook-form/form-provider'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  RHFAutocomplete,
  RHFSelect,
  RHFTextField,
} from '../../../../shared/sdk/hook-form'
import { useResponsive } from '../../../../shared/hooks/use-responsive'
import { useDegreeCertificateAttendanceForm } from '../hooks/useDegreeCertificateAttendanceForm'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { Controller } from 'react-hook-form'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import {
  DEGREE_ATTENDANCE_ROLES_OPTIONS,
  IDegreeCertificatesAttendee,
} from '../../domain/entities/IDegreeCertificateAttendee'

interface Props {
  onClose: VoidFunction
  currentAttendee?: IDegreeCertificatesAttendee
  degreeCertificateId: number
}
export const DegreeCertificateAttendeeNewEditForm = (props: Props) => {
  const loader = useLoaderStore((state) => state.loader)
  const {
    handleSubmit,
    onSubmit,
    methods,
    unusedFunctionaries,
    setSearchField,
  } = useDegreeCertificateAttendanceForm(
    props.currentAttendee,
    props.degreeCertificateId,
  )

  const { control } = methods

  const mdUp = useResponsive('up', 'md')

  const renderProperties = (
    <>
      <Grid xs={12} md={8}>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFAutocomplete
              name={'member'}
              label="Funcionario"
              placeholder="Escribe el nombre o cédula del miembro deseado"
              noOptionsText="No hay resultados"
              freeSolo
              loading={loader.length > 0}
              getOptionLabel={(option) =>
                (option as { label: string; id: number }).label
              }
              onInputChange={(_event, newInputValue) => {
                setSearchField(newInputValue)
              }}
              getOptionKey={(option) => (option as { id: number }).id}
              options={unusedFunctionaries.map((functionary) => ({
                id: functionary.id,
                label: `${functionary.firstName} ${functionary.firstLastName} ${functionary.secondLastName} - ${functionary.dni}`,
              }))}
            />

            <RHFSelect
              name="role"
              label="Rol"
              InputLabelProps={{ shrink: true }}
            >
              {DEGREE_ATTENDANCE_ROLES_OPTIONS.map((council) => (
                <MenuItem key={council.value} value={council.value}>
                  {council.label}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFTextField name="details" label="Documento de asignación" />

            <Controller
              name="assignationDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  value={field.value !== undefined ? dayjs(field.value) : null}
                  onChange={(newValue) => {
                    field.onChange(newValue?.toDate())
                  }}
                  label="Fecha de asignación"
                  format="dddd/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                  disablePast
                />
              )}
            />
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
          justifyContent: 'end',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <Button
          variant="outlined"
          size="large"
          onClick={() => {
            methods.reset()
            props.onClose()
          }}
        >
          Cancelar
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={loader.length > 0}
        >
          Crear
        </LoadingButton>
      </Grid>
    </>
  )

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ p: 3 }}>
        {renderProperties}
        {renderActions}
      </Stack>
    </FormProvider>
  )
}
