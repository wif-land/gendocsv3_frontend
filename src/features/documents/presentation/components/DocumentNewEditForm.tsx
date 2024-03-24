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
  RHFSelect,
  RHFSwitch,
  RHFTextField,
} from '../../../../shared/sdk/hook-form'
import FormProvider from '../../../../shared/sdk/hook-form/form-provider'
import { Box, MenuItem, Select } from '@mui/material'
import { DocumentModel } from '../../data/models/DocumentsModel'
import { useDocumentsForm } from '../hooks/useDocumentsForm'
import { ProcessModel } from '../../../processes/data/models/ProcessesModel'

type Props = {
  currentDocument?: DocumentModel
}

export const DocumentNewEditForm = ({ currentDocument }: Props) => {
  const mdUp = useResponsive('up', 'md')
  const {
    methods,
    councils,
    isCouncilSelected,
    isProcessSelected,
    isTemplateSelected,
    processes,
    onSubmit,
    setSelectedProcessId,
  } = useDocumentsForm(currentDocument)

  const { handleSubmit, watch } = methods

  const values = watch()

  console.log({ values })

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Detalles
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Se elije el consejo, proceso, plantilla y numeración del documento
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFSelect
              name="councilId"
              label="Consejo"
              className="w-full"
              placeholder="Consejo"
            >
              {councils! &&
                councils.map((council) => (
                  <MenuItem
                    key={council.id as number}
                    value={council.id as number}
                  >
                    {council.name}
                  </MenuItem>
                ))}
            </RHFSelect>

            {isCouncilSelected.value && (
              <>
                <RHFSelect
                  name="process"
                  label="Proceso"
                  className="w-full"
                  placeholder="Proceso"
                  onChange={(e) => {
                    console.log(e.target.value)

                    setSelectedProcessId(e.target.value as ProcessModel)
                    isProcessSelected.onTrue()
                  }}
                >
                  {processes! &&
                    processes.map((process) => (
                      <MenuItem
                        key={process.id as number}
                        value={process.id as number}
                      >
                        {process.name}
                      </MenuItem>
                    ))}
                </RHFSelect>
              </>
            )}

            {isProcessSelected.value && (
              <>
                <Select
                  name="template"
                  label="Plantilla"
                  className="w-full"
                  placeholder="Plantilla"
                >
                  <MenuItem value={1}>Plantilla 1</MenuItem>
                  <MenuItem value={2}>Plantilla 2</MenuItem>
                </Select>
              </>
            )}

            {isTemplateSelected.value && (
              <>
                <RHFTextField
                  name="number"
                  label="Número"
                  type="number"
                  about="Número del documento"
                />
              </>
            )}
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
            Se elijen
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="description"
              label="Descripción"
              multiline
              about="Descripción del documento"
              rows={2}
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
