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
import Iconify from '../../../../core/iconify'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { DocumentSeeNumerationDialog } from './DocumentSeeNumerationDialog'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { useRouter } from 'next/navigation'
import CustomPopover from '../../../../shared/sdk/custom-popover/custom-popover'
import { usePopover } from '../../../../shared/sdk/custom-popover'
import { StudentNewEditForm } from '../../../../features/students/presentation/components/StudentNewEditForm'
import DocsByStudentListView from '../view/DocsByStudentListView'
import DegreesByStudentListView from '../view/DegreesByStudentListView'

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
    getSelectedStudent,
    setSearchCouncilField,
    setSearchProcessField,
  } = useDocumentsForm(currentDocument)

  const { formState, handleSubmit, getValues } = methods
  const seeNumeration = useBoolean(false)
  const isStudentModalOpen = useBoolean(false)
  const isDocumentModalOpen = useBoolean(false)
  const isDegreeModalOpen = useBoolean(false)

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
            <RHFAutocomplete
              name="councilId"
              label="Consejo"
              className="w-full"
              placeholder="Consejo"
              noOptionsText="No hay consejos activos"
              freeSolo
              loading={loader.length > 0}
              getOptionLabel={(option: any) =>
                (
                  option as {
                    id: number
                    label: string
                  }
                ).label
              }
              onInputChange={(_event, newInputValue) => {
                setSearchCouncilField(newInputValue)
              }}
              getOptionKey={(option) => (option as { id: number }).id}
              isOptionEqualToValue={(option, value) => option === value}
              options={
                councils?.map((council) => ({
                  id: council.id,
                  label: council.name,
                })) || []
              }
            />

            {isCouncilSelected.value && (
              <>
                <RHFAutocomplete
                  name="processId"
                  label="Proceso"
                  className="w-full"
                  placeholder="Proceso"
                  noOptionsText="No hay procesos activos"
                  freeSolo
                  loading={loader.length > 0}
                  getOptionLabel={(option) =>
                    (option as { label: string }).label
                  }
                  onInputChange={(_event, newInputValue) => {
                    setSearchProcessField(newInputValue)
                  }}
                  getOptionKey={(option) => (option as { id: number }).id}
                  options={processes?.map((process) => ({
                    id: process.id,
                    label: process.name,
                  }))}
                />
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
                  selectedProcess.templateProcesses
                    ?.filter((template) => template.isActive)
                    ?.map((template) => (
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
            {isProcessSelected &&
              processes?.find(
                (process) =>
                  process.templateProcesses?.find(
                    (template) => template.id === getValues('templateId'),
                  )?.hasStudent,
              ) && (
                <Stack
                  spacing={3}
                  sx={{ display: 'flex', flexDirection: 'row' }}
                >
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
                        isDocumentModalOpen.onTrue()
                      }}
                    >
                      <Iconify icon="solar:documents-bold-duotone" />
                      Documentos
                    </MenuItem>

                    <MenuItem
                      onClick={() => {
                        isDegreeModalOpen.onTrue()
                      }}
                    >
                      <Iconify icon="solar:documents-bold-duotone" />
                      Actas de grado
                    </MenuItem>
                  </CustomPopover>
                </Stack>
              )}
            {isProcessSelected &&
              processes?.find(
                (process) =>
                  process.templateProcesses?.find(
                    (template) => template.id === getValues('templateId'),
                  )?.hasFunctionary,
              ) && (
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
              )}

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
          onClick={() => {
            console.log(formState.errors)
            handleSubmit(onSubmit)
          }}
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

  const renderDocumentsModal = (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={isDocumentModalOpen.value}
      onClose={isDocumentModalOpen.onFalse}
      sx={{
        overflow: 'hidden',
        padding: 10,
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>Documentos del estudiante</DialogTitle>

      <DialogContent
        sx={{ typography: 'body2', overflowY: 'auto', paddingX: 10 }}
      >
        <DocsByStudentListView
          studentId={methods.watch('student' as any)?.id}
        />
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => {
            isDocumentModalOpen.onFalse()
          }}
        >
          Regresar
        </Button>
      </DialogActions>
    </Dialog>
  )

  const renderDegreeModal = (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={isDegreeModalOpen.value}
      onClose={isDegreeModalOpen.onFalse}
      sx={{
        overflow: 'hidden',
        padding: 10,
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>Actas de grado del estudiante</DialogTitle>

      <DialogContent
        sx={{ typography: 'body2', overflowY: 'auto', paddingX: 10 }}
      >
        <DegreesByStudentListView
          studentDni={methods.watch('student' as any)?.label.split(' - ')[0]}
        />
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => {
            isDegreeModalOpen.onFalse()
          }}
        >
          Regresar
        </Button>
      </DialogActions>
    </Dialog>
  )

  return (
    <>
      {renderDegreeModal}
      {renderStudentModal}
      {renderDocumentsModal}
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
