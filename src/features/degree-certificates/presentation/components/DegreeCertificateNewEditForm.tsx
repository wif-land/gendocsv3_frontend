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
import { DegreeCertificateModel } from '../../data/model'
import { useDegreeCertificateForm } from '../hooks/useDegreeCertificateForm'

type Props = {
  currentDegreeCertificate?: DegreeCertificateModel
}

export const DegreeCertificateNewEditForm = ({
  currentDegreeCertificate,
}: Props) => {
  const mdUp = useResponsive('up', 'md')
  const { methods, onSubmit } = useDegreeCertificateForm()

  const { handleSubmit } = methods

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

        <LoadingButton type="submit" variant="contained" size="large">
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
