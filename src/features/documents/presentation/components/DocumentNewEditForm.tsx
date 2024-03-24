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
  RHFTextField,
} from '../../../../shared/sdk/hook-form'
import FormProvider from '../../../../shared/sdk/hook-form/form-provider'
import { MenuItem } from '@mui/material'
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
    students,
    functionaries,
    selectedProcess,
    onSubmit,
    setSelectedProcess,
  } = useDocumentsForm(currentDocument)

  const { handleSubmit, getValues } = methods

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
              {councils &&
                councils.map((council: any) => (
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
                    setSelectedProcess(
                      processes!.find(
                        (process) => process.id === Number(e.target.value),
                      ) || ({} as ProcessModel),
                    )
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
                <RHFSelect
                  name="template"
                  label="Plantilla"
                  className="w-full"
                  placeholder="Plantilla"
                >
                  {selectedProcess! &&
                    selectedProcess.templateProcesses?.map((template) => (
                      <MenuItem
                        key={template.id as number}
                        value={template.id as number}
                      >
                        {template.name}
                      </MenuItem>
                    ))}
                </RHFSelect>
              </>
            )}

            {!isTemplateSelected.value && (
              <>
                <RHFTextField
                  name="number"
                  label="Siguiente número disponible"
                  type="number"
                  disabled
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
            Se elijen estudiantes y funcionarios
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFAutocomplete
              name="studentId"
              label="Estudiante"
              className="w-full"
              placeholder="Estudiante"
              freeSolo
              options={students?.map((student) => ({
                id: student.id,
                label: `${student.dni} - ${student.firstLastName} ${student.secondLastName} ${student.firstName}`,
              }))}
            />

            <RHFAutocomplete
              name="functionariesIds"
              label="Funcionarios"
              className="w-full"
              placeholder="Funcionarios"
              freeSolo
              multiple
              options={functionaries
                ?.map((functionary) => ({
                  id: functionary.id,
                  label: `${functionary.dni} - ${functionary.firstLastName} ${functionary.firstName}`,
                }))
                .filter(
                  (student) =>
                    getValues('functionariesIds')?.some(
                      (value) => value.id === student.id,
                    ) === false,
                )}
            />

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
