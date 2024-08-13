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
  DEGREE_ATTENDANCE_ROLES,
  DEGREE_ATTENDANCE_ROLES_OPTIONS,
  IDegreeCertificatesAttendee,
} from '../../domain/entities/IDegreeCertificateAttendee'
import { useDegreeCertificateStore } from '../store/useDegreeCertificateStore'
import { useEffect, useState } from 'react'
import { DATE_FORMAT } from '../../../../core/utils/format-time'

interface Props {
  onClose: VoidFunction
  currentAttendee?: IDegreeCertificatesAttendee
  degreeCertificateId: number
}
export const DegreeAttendeeNewEditForm = (props: Props) => {
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
    props.onClose,
  )
  const { members } = useDegreeCertificateStore().degreeCertificate
  const [positionsPicked, setPositionsPicked] = useState<
    DEGREE_ATTENDANCE_ROLES[]
  >([])

  useEffect(() => {
    if (!members || members.length === 0) return

    const positions = members?.map((member) => member.role)
    const hasTutor = positions.includes(DEGREE_ATTENDANCE_ROLES.MENTOR)
    const hasPresident = positions.includes(DEGREE_ATTENDANCE_ROLES.PRESIDENT)
    const mainMembersLength = positions.filter(
      (position) => position === DEGREE_ATTENDANCE_ROLES.PRINCIPAL,
    )?.length

    const temporalPicked = []

    if (hasTutor) {
      temporalPicked.push(DEGREE_ATTENDANCE_ROLES.MENTOR)
    }

    if (hasPresident) {
      temporalPicked.push(DEGREE_ATTENDANCE_ROLES.PRESIDENT)
    }

    if (mainMembersLength === 2) {
      temporalPicked.push(DEGREE_ATTENDANCE_ROLES.PRINCIPAL)
    }

    setPositionsPicked(temporalPicked)
  }, [members])

  const { control } = methods

  const mdUp = useResponsive('up', 'md')

  const renderProperties = (
    <>
      <Grid xs={12} md={8}>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFAutocomplete
              name="functionary"
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
              disabled={!!props.currentAttendee}
            >
              {DEGREE_ATTENDANCE_ROLES_OPTIONS.filter(
                (role) =>
                  !!props.currentAttendee ||
                  !positionsPicked.includes(role.value),
              ).map((council) => (
                <MenuItem key={council.value} value={council.value}>
                  {council.label}
                </MenuItem>
              ))}
            </RHFSelect>

            {methods.watch('role') &&
              methods.watch('role') !== DEGREE_ATTENDANCE_ROLES.MENTOR && (
                <RHFTextField name="details" label="Documento de asignación" />
              )}

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
                  format={DATE_FORMAT}
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
          {props.currentAttendee ? 'Editar' : 'Crear'}
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
