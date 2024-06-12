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
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
} from '@mui/material'
import { DocumentModel } from '../../data/models/DocumentsModel'
import { useDocumentsForm } from '../hooks/useDocumentsForm'
import { ProcessModel } from '../../../processes/data/models/ProcessesModel'
import Iconify from '../../../../core/iconify'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { DocumentSeeNumerationDialog } from './DocumentSeeNumerationDialog'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { useRouter } from 'next/navigation'
import CustomPopover from '../../../../shared/sdk/custom-popover/custom-popover'
import { usePopover } from '../../../../shared/sdk/custom-popover'
import { StudentNewEditForm } from '../../../../features/students/presentation/components/StudentNewEditForm'

type Props = {
  currentDocument?: DocumentModel
}

export const DocumentNewEditForm = ({ currentDocument }: Props) => {
  const mdUp = useResponsive('up', 'md')
  const router = useRouter()
  const popover = usePopover()
  const { loader } = useLoaderStore()
  const {
    methods,
    councils,
    isCouncilSelected,
    isProcessSelected,
    isTemplateSelected,
    processes,
    students,
    functionaries,
    numbers,
    selectedProcess,
    onSubmit,
    setSelectedProcess,
    getSelectedStudent,
  } = useDocumentsForm(currentDocument)

  const { handleSubmit, getValues } = methods
  const seeNumeration = useBoolean(false)
  const isStudentModalOpen = useBoolean(false)

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
              <RHFSelect
                name="templateId"
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
            )}

            {isTemplateSelected.value && isCouncilSelected.value && (
              <RHFTextField
                name="number"
                label="Siguiente número disponible"
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={seeNumeration.onToggle} edge="end">
                        <Iconify icon={'solar:eye-bold'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
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
            <Stack spacing={3} sx={{ display: 'flex', flexDirection: 'row' }}>
              <RHFAutocomplete
                name="student"
                label="Estudiante"
                placeholder="Estudiante"
                sx={{
                  flexGrow: 1,
                }}
                freeSolo
                options={students?.map((student) => ({
                  id: student.id,
                  label: `${student.dni} - ${student.firstLastName} ${student.secondLastName} ${student.firstName}`,
                }))}
                value={getSelectedStudent()}
                onSelect={() => {
                  methods.setValue('student', getSelectedStudent())
                }}
              />
              {methods.watch('student') && (
                <>
                  <IconButton onClick={popover.onOpen}>
                    <Iconify icon="eva:more-vertical-fill" />
                  </IconButton>
                </>
              )}
              <CustomPopover
                open={popover.open}
                onClose={popover.onClose}
                arrow="right-top"
                sx={{ width: 160 }}
              >
                <MenuItem
                  onClick={() => {
                    isStudentModalOpen.onTrue()
                  }}
                >
                  <Iconify icon="ic:round-edit" />
                  Editar
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    popover.onClose()
                  }}
                >
                  <Iconify icon="solar:documents-bold-duotone" />
                  Documentos
                </MenuItem>
              </CustomPopover>
            </Stack>

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
                      (value: any) => value.id === student.id,
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
            router.back()
          }}
        >
          Cancelar
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={loader.length > 0}
          disabled={isStudentModalOpen.value}
        >
          {!currentDocument ? 'Crear' : 'Guardar'}
        </LoadingButton>
      </Grid>
    </>
  )

  const renderStudentModal = (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={isStudentModalOpen.value}
      onClose={isStudentModalOpen.onFalse}
      sx={{
        overflow: 'hidden',
        padding: 10,
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>Editar estudiante</DialogTitle>

      <DialogContent
        sx={{ typography: 'body2', overflowY: 'auto', paddingX: 10 }}
      >
        <StudentNewEditForm
          currentStudent={students.find(
            (student) => student.id === methods.watch('student' as any)?.id,
          )}
          fromModal={true}
        />
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => {
            isStudentModalOpen.onFalse()
          }}
        >
          Regresar
        </Button>
      </DialogActions>
    </Dialog>
  )

  return (
    <>
      {renderStudentModal}
      <DocumentSeeNumerationDialog
        open={seeNumeration.value}
        onClose={seeNumeration.onFalse}
        numeration={numbers}
        setNumeration={(number) => {
          methods.setValue('number', number)
          seeNumeration.onFalse()
        }}
      />
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {renderDetails}

          {renderProperties}

          {renderActions}
        </Grid>
      </FormProvider>
    </>
  )
}
