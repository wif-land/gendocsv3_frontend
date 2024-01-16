import LoadingButton from '@mui/lab/LoadingButton'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Unstable_Grid2'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import { useResponsive } from '../../../../shared/hooks/use-responsive'
import { RHFTextField } from '../../../../shared/components/hook-form'
import FormProvider from '../../../../shared/components/hook-form/form-provider'

type Props = {
  currentProduct?: any
}

export default function CouncilNewEditForm({ currentProduct }: Props) {
  const mdUp = useResponsive('up', 'md')
  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Detalles
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            En qué consiste el consejo y cómo se aplica
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="Nombre del Consejo" />
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
            Participantes
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Añade los participantes del consejo, elije un presidente.
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="newLabel.content" label="New Label" fullWidth />

            <Divider sx={{ borderStyle: 'dashed' }} />

            <RHFTextField name="newLabel.content" label="New Label" fullWidth />
            <RHFTextField name="newLabel.content" label="New Label" fullWidth />
          </Stack>
        </Card>
      </Grid>
    </>
  )

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', justifyContent: 'end' }}>
        <LoadingButton type="submit" variant="contained" size="large">
          {!currentProduct ? 'Crear consejo' : 'Guardar cambios'}
        </LoadingButton>
      </Grid>
    </>
  )

  return (
    <FormProvider
      methods={[]}
      onSubmit={() => {
        console.log('ajajaj')
      }}
    >
      <Grid container spacing={3}>
        {renderDetails}

        {renderProperties}

        {renderActions}
      </Grid>
    </FormProvider>
  )
}
