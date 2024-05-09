/* eslint-disable @typescript-eslint/no-unused-vars */
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
  RHFSwitch,
  RHFTextField,
} from '../../../../shared/sdk/hook-form'
import FormProvider from '../../../../shared/sdk/hook-form/form-provider'
import { Box } from '@mui/material'
import { useDegreeCertificateForm } from '../hooks/useDegreeCertificateForm'
import { IDegreeCertificate } from '../../domain/entities/IDegreeCertificates'
import { Controller } from 'react-hook-form'
import { MobileDatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { RHFSelect } from '../../../../shared/sdk/hook-form/rhf-select'
import { MenuItem } from '@nextui-org/react'
import { useCertificateData } from '../../../../core/providers/certificate-degree-provider'
import { useLocations } from '../../../../core/providers/locations-provider'

type Props = {
  currentDegreeCertificate?: IDegreeCertificate
}

export const DegreeCertificateNewEditForm = ({
  currentDegreeCertificate,
}: Props) => {
  const mdUp = useResponsive('up', 'md')
  const { methods, onSubmit, students, setInputValue, isOpen, loading } =
    useDegreeCertificateForm(currentDegreeCertificate)

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = methods

  const { certificateTypes } = useCertificateData()
  const { provinces } = useLocations()
  console.log(provinces)

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Detalles
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Hola
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack
            spacing={3}
            sx={{ p: 3, display: 'flex', flexDirection: 'row' }}
          >
            <RHFTextField
              name="number"
              label="Numeracion de acta de grado"
              required
              sx={{ flexGrow: 1 }}
            />
            <RHFTextField
              name="aux_number"
              label="Numeracion"
              required
              sx={{ flexGrow: 1 }}
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
            Estudiante
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Información relevante del estudiante
          </Typography>
        </Grid>
      )}
      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFAutocomplete
              name="name"
              label="Estudiante"
              open={isOpen.value}
              onOpen={isOpen.onTrue}
              onClose={() => {
                setInputValue('')
                isOpen.onFalse()
              }}
              loading={loading}
              noOptionsText="No hay resultados"
              options={students?.map(
                (student) =>
                  `${student.firstName} ${student.secondName} ${student.firstLastName} ${student.secondLastName} - ${student.dni}`,
              )}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue)
              }}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => {
                const {
                  dni,
                  firstName,
                  firstLastName,
                  secondName,
                  secondLastName,
                } = students.filter(
                  (student) =>
                    option ===
                    `${student.firstName} ${student.secondName} ${student.firstLastName} ${student.secondLastName} - ${student.dni}`,
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
          </Stack>
          <Stack
            spacing={3}
            sx={{ p: 3, pt: 0, display: 'flex', flexDirection: 'row' }}
          >
            <RHFTextField
              name="startStudiesDate"
              label="Fecha de inicio de estudios"
              required
              sx={{ flexGrow: 1 }}
            />
            <RHFTextField
              name="endStudiesDate"
              label="Fecha de finalización de estudios"
              required
              sx={{ flexGrow: 1 }}
            />
          </Stack>
          <Stack
            spacing={3}
            sx={{ p: 3, pt: 0, display: 'flex', flexDirection: 'row' }}
          >
            <RHFTextField
              name="approvedCredits"
              label="Créditos aprobados"
              required
              sx={{ flexGrow: 1 }}
            />
            <RHFTextField
              name="intershipHours"
              label="Horas de práctica"
              required
              sx={{ flexGrow: 1 }}
            />
          </Stack>
          <Stack
            spacing={3}
            sx={{ p: 3, pt: 0, display: 'flex', flexDirection: 'row' }}
          >
            <RHFTextField
              name="vinculationHours"
              label="Horas de vinculación/Servicio comunitario"
              required
              sx={{ flexGrow: 1 }}
            />
            <RHFTextField
              name="bachelorDegree"
              label="Titulo de bachiller"
              required
              sx={{ flexGrow: 1 }}
            />
          </Stack>
          <Stack
            spacing={3}
            sx={{ p: 3, pt: 0, display: 'flex', flexDirection: 'row' }}
          >
            <RHFTextField
              name="canton"
              label="Cantón de residencia"
              required
              sx={{ flexGrow: 1 }}
            />
            <RHFTextField
              name="province"
              label="Provincia de residencia"
              required
              sx={{ flexGrow: 1 }}
            />
          </Stack>
        </Card>
      </Grid>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Acta de Grado
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Información relevante del acta de grado
          </Typography>
        </Grid>
      )}
      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="topic"
              label="Tema"
              required
              sx={{ flexGrow: 1 }}
            />
            <Controller
              name="presentationDate"
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
                  label="Fecha de presentación"
                  format="dddd/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                  closeOnSelect
                />
              )}
            />

            <RHFTextField
              name="duration"
              label="Duración"
              required
              sx={{ flexGrow: 1 }}
            />

            <RHFSelect name="certificateType" label="Tipo de Defensa" required>
              {<MenuItem></MenuItem>}
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
        sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <RHFSwitch name="isActive" label="Acta activa" />
        </Box>

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {!currentDegreeCertificate ? 'Crear' : 'Guardar'}
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
