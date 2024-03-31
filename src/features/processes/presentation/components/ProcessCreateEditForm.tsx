import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Unstable_Grid2'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

import { useResponsive } from '../../../../shared/hooks/use-responsive'
import { RHFSwitch, RHFTextField } from '../../../../shared/sdk/hook-form'
import FormProvider from '../../../../shared/sdk/hook-form/form-provider'

import { IProcess } from '../../domain/entities/IProcess'

import { useProcessForm } from '../hooks/useProcessForm'

type Props = {
  currentProcess?: IProcess
}

export const ProcessNewEditForm = ({ currentProcess }: Props) => {
  const mdUp = useResponsive('up', 'md')
  const { methods, onSubmit } = useProcessForm(currentProcess)

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const renderGeneralInfo = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Detalles
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Información general del proceso, como nombre.
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

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <RHFSwitch name="isActive" label="Proceso activo" />
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
        {renderGeneralInfo}

        {renderActions}
      </Grid>
    </FormProvider>
  )
}
