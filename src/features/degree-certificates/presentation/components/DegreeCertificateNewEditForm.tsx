/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
import LoadingButton from '@mui/lab/LoadingButton'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Unstable_Grid2'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import { useResponsive } from '../../../../shared/hooks/use-responsive'
import { RHFSwitch, RHFTextField } from '../../../../shared/sdk/hook-form'
import FormProvider from '../../../../shared/sdk/hook-form/form-provider'
import { Box } from '@mui/material'
import { DegreeCertificateModel } from '../../data/models/CertificateDegreeModel'
import { useDegreeCertificateForm } from '../hooks/useDegreeCertificateForm'
import RHFAutocomplete from '../../../../shared/sdk/hook-form/rhf-autocomplete'
// import { useLocations } from '../../../../core/providers/locations-provider'
type Props = {
  currentDegreeCertificate?: DegreeCertificateModel
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
  } = methods

  // const { cities, provinces } = useLocations()
  // console.log(cities, provinces)
  //  const { cities, provinces } = useLocations()

  //  autocoplete value = student.nombre , student,city, student.citiy.orvince.id

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Numeración
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            NOTA TEMPORAL: La numeracion no sé cómo funciona pero supongo que es
            asiganda automaticamente
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
              name="name"
              label="Numeracion de acta de grado"
              required
              sx={{ flexGrow: 1 }}
            />
            <RHFTextField
              name="name"
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
            {/* <RHFTextField
              name="name"
              label="Estudiante"
              required
              sx={{ flexGrow: 1 }}
            /> */}
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
              name="name"
              label="Cantón de residencia"
              required
              sx={{ flexGrow: 1 }}
            />
            <RHFTextField
              name="name"
              label="Provincia de residencia"
              required
              sx={{ flexGrow: 1 }}
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
        sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <RHFSwitch name="isActive" label="Consejo activo" />
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
