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
import { ITemplate } from '../../domain/entities/ITemplate'
import { useTemplatesForm } from '../hooks/useTemplatesForm'

type Props = {
  currentTemplate?: ITemplate
}

export const TemplateNewEditForm = ({ currentTemplate }: Props) => {
  const mdUp = useResponsive('up', 'md')
  const { methods, onSubmit } = useTemplatesForm(currentTemplate)

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
            Información general de la plantilla, como nombre.
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="Nombre" required />
            <RHFSwitch name="hasStudent" label="Tiene estudiantes?" />

            <RHFSwitch name="hasFunctionary" label="Tiene funcionario?" />
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
          <RHFSwitch name="isActive" label="Plantilla activa" />
        </Box>

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {!currentTemplate ? 'Crear' : 'Guardar'}
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
