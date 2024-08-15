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
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
} from '@mui/material'
import { useDegreeCertificateForm } from '../hooks/useDegreeCertificateForm'
import { IDegreeCertificate } from '../../domain/entities/IDegreeCertificates'
import { Controller } from 'react-hook-form'
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { RHFSelect } from '../../../../shared/sdk/hook-form/rhf-select'

import { useCertificateData } from '../../../../core/providers/certificate-degree-provider'
import { ICanton } from '../../../../core/providers/domain/entities/ILocationProvider'
import { useRouter } from 'next/navigation'
import Iconify from '../../../../core/iconify'
import CustomPopover from '../../../../shared/sdk/custom-popover/custom-popover'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { usePopover } from '../../../../shared/sdk/custom-popover'
import { StudentNewEditForm } from '../../../../features/students/presentation/components/StudentNewEditForm'
import DocsByStudentListView from '../../../../features/documents/presentation/view/DocsByStudentListView'
import { degreeTemplatesStore } from '../../../../features/degcer-templates/presentation/store/degCerTemplatesStore'
import { ICareer } from '../../../../features/careers/domain/entities/ICareer'
import DegreesByStudentListView from '../../../../features/documents/presentation/view/DegreesByStudentListView'
import {
  DATE_FORMAT,
  DATE_TIME_FORMAT,
} from '../../../../core/utils/format-time'
import { checkUpdateInputPermission } from '../../../../shared/utils/InputUtil'
import { DegreeCertificateModel } from '../../data/models/DegreeCertificateModel'
import { useAccountStore } from '../../../../features/auth/presentation/state/useAccountStore'

type Props = {
  currentDegreeCertificate?: IDegreeCertificate
}

export const DegreeCertificateNewEditForm = ({
  currentDegreeCertificate,
}: Props) => {
  const mdUp = useResponsive('up', 'md')
  const router = useRouter()
  const isStudentModalOpen = useBoolean(false)
  const isDocumentModalOpen = useBoolean(false)
  const isDegreeModalOpen = useBoolean(false)
  const isNumerationModalOpen = useBoolean(false)
  const popover = usePopover()

  const { degCerTemplates } = degreeTemplatesStore()
  const {
    methods,
    onSubmit,
    students,
    setInputValue,
    isOpen,
    loading,
    refreshStudent,
    enqueuedNumbers,
  } = useDegreeCertificateForm(currentDegreeCertificate)

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
    watch,
    getValues,
  } = methods

  const { degreeModalities, rooms } = useCertificateData()

  const { user } = useAccountStore()

  const renderDetails = (
    <>
      {mdUp && (
        <Grid
          md={4}
          sx={{
            display: currentDegreeCertificate ? 'block' : 'none',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 0.5,
            }}
          >
            Detalles
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Numeración de acta de grado
          </Typography>
        </Grid>
      )}

      <Grid
        xs={12}
        md={8}
        sx={{
          display: currentDegreeCertificate ? 'block' : 'none',
        }}
      >
        <Card>
          {!mdUp && <CardHeader title="Details" />}
          <Stack
            spacing={3}
            sx={{ p: 3, display: 'flex', flexDirection: 'row' }}
          >
            <RHFTextField
              name="number"
              label="Numeracion de acta de grado"
              disabled
              sx={{ flexGrow: 1 }}
            />
            <Button
              onClick={() => isNumerationModalOpen.onTrue()}
              variant="contained"
            >
              <Iconify icon="tabler:number" />
            </Button>
            {/* <RHFTextField
              name="auxNumber"
              label="Numeracion"
              disabled
              sx={{ flexGrow: 1 }}
            /> */}
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
            <Stack spacing={3} sx={{ display: 'flex', flexDirection: 'row' }}>
              <RHFAutocomplete
                name="selectedValue"
                label="Estudiante"
                disabled={
                  isSubmitting ||
                  checkUpdateInputPermission(
                    'studentId',
                    user!.role!,
                    DegreeCertificateModel.name,
                  )
                }
                sx={{
                  flexGrow: 1,
                }}
                open={isOpen.value}
                onOpen={isOpen.onTrue}
                onClose={() => {
                  setInputValue('')
                  isOpen.onFalse()
                }}
                loading={loading}
                noOptionsText="No hay resultados"
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={students
                  ?.filter((student) => student.isActive)
                  ?.map((student) => ({
                    label: `${student.firstName} ${student.secondName} ${student.firstLastName} ${student.secondLastName} - ${student.dni}`,
                    id: student.id,
                  }))}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue)
                }}
                getOptionLabel={(option) => (option as { label: string }).label}
              />
              {methods.watch('selectedValue')?.id !== 0 && (
                <>
                  <IconButton onClick={popover.onOpen}>
                    <Iconify icon="eva:more-vertical-fill" />
                  </IconButton>
                </>
              )}
            </Stack>
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
                disabled={
                  checkUpdateInputPermission(
                    'studentId',
                    user!.role!,
                    DegreeCertificateModel.name,
                  ) || methods.watch('student').id === 0
                }
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

          <Stack
            spacing={3}
            sx={{ p: 3, pt: 0, display: 'flex', flexDirection: 'row' }}
          >
            <TextField
              label="Carrera"
              value={(getValues('student')?.career as ICareer)?.name || ''}
              disabled
              sx={{ flexGrow: 1 }}
            />
          </Stack>

          <Stack
            spacing={3}
            sx={{ p: 3, pt: 0, display: 'flex', flexDirection: 'row' }}
          >
            <TextField
              label="Fecha de inicio de estudios"
              value={getValues('student')?.startStudiesDate || ''}
              disabled
              sx={{ flexGrow: 1 }}
            />
            <TextField
              name="student.endStudiesDate"
              disabled
              label="Fecha de finalización de estudios"
              value={getValues('student')?.endStudiesDate || ''}
              sx={{ flexGrow: 1 }}
            />
          </Stack>

          <Stack
            spacing={3}
            sx={{ p: 3, pt: 0, display: 'flex', flexDirection: 'row' }}
          >
            <TextField
              label="Créditos aprobados"
              value={getValues('student')?.approvedCredits || ''}
              disabled
              sx={{ flexGrow: 1 }}
            />
            <TextField
              label="Horas de práctica"
              value={getValues('student')?.internshipHours || ''}
              disabled
              sx={{ flexGrow: 1 }}
            />
          </Stack>

          <Stack
            spacing={3}
            sx={{ p: 3, pt: 0, display: 'flex', flexDirection: 'row' }}
          >
            <TextField
              label="Horas de vinculación/Servicio comunitario"
              value={getValues('student')?.vinculationHours || ''}
              disabled
              sx={{ flexGrow: 1 }}
            />
            <TextField
              label="Titulo de bachiller"
              value={getValues('student')?.bachelorDegree || ''}
              disabled
              sx={{ flexGrow: 1 }}
            />
          </Stack>

          <Stack
            spacing={3}
            sx={{
              p: 3,
              pt: 0,
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
            }}
          >
            <TextField
              label="Provincia de residencia"
              value={
                (watch('student').canton as ICanton)?.province.name ||
                (currentDegreeCertificate?.student.canton as ICanton)?.province
                  .name ||
                ''
              }
              disabled
              sx={{ flexGrow: 1 }}
            />

            <TextField
              label="Ciudad de residencia"
              value={
                (watch('student').canton as ICanton)?.name ||
                (currentDegreeCertificate?.student.canton as ICanton)?.name ||
                ''
              }
              disabled
              sx={{ flexGrow: 1 }}
            />
          </Stack>
        </Card>
      </Grid>
      {methods.watch('student').id! > 0 && (
        <>
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
                  disabled={checkUpdateInputPermission(
                    'topic',
                    user!.role!,
                    DegreeCertificateModel.name,
                  )}
                  inputProps={{
                    maxLength: 255,
                  }}
                  sx={{ flexGrow: 1 }}
                />
                {methods.watch('student').id! > 0 && (
                  <RHFSelect
                    id="certificateTypeId"
                    label="Modalidad de grado"
                    name="certificateTypeId"
                    required
                    disabled={checkUpdateInputPermission(
                      'certificateTypeId',
                      user!.role!,
                      DegreeCertificateModel.name,
                    )}
                  >
                    {degCerTemplates
                      .filter(
                        (type) =>
                          type.certificateTypeCareers.find(
                            (certificateTypeCareer) =>
                              certificateTypeCareer.career.id ===
                              (methods.watch('student').career as ICareer)?.id,
                          ) !== undefined,
                      )
                      .map((certificateType) => (
                        <MenuItem
                          key={certificateType.id}
                          value={certificateType.id}
                        >
                          {certificateType.name}
                        </MenuItem>
                      ))}
                  </RHFSelect>
                )}

                <Stack
                  spacing={3}
                  sx={{ display: 'flex', flexDirection: 'row' }}
                >
                  <RHFSelect
                    id="degreeModalityId"
                    label="Tipo de grado"
                    name="degreeModalityId"
                    disabled={checkUpdateInputPermission(
                      'degreeModalityId',
                      user!.role!,
                      DegreeCertificateModel.name,
                    )}
                    required
                  >
                    {degreeModalities.map((modality) => (
                      <MenuItem key={modality.id} value={modality.id}>
                        {modality.name}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                  {methods.watch('degreeModalityId') &&
                    Number(methods.watch('degreeModalityId')) === 1 && (
                      <RHFTextField
                        name="link"
                        label="Link"
                        disabled={checkUpdateInputPermission(
                          'link',
                          user!.role!,
                          DegreeCertificateModel.name,
                        )}
                        inputProps={{ maxLength: 255 }}
                        sx={{ flexGrow: 1 }}
                      />
                    )}
                </Stack>

                {methods.watch('degreeModalityId') &&
                  Number(methods.watch('degreeModalityId')) === 2 && (
                    <RHFSelect
                      id="roomId"
                      label="Aula"
                      name="roomId"
                      disabled={
                        checkUpdateInputPermission(
                          'roomId',
                          user!.role!,
                          DegreeCertificateModel.name,
                        ) || !methods.watch('degreeModalityId')
                      }
                    >
                      {rooms.map((room) => (
                        <MenuItem key={room.id} value={room.id}>
                          {room.name}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  )}

                <RHFTextField
                  name="duration"
                  label="Duración (min)"
                  type="number"
                  disabled={checkUpdateInputPermission(
                    'duration',
                    user!.role!,
                    DegreeCertificateModel.name,
                  )}
                  sx={{ flexGrow: 1 }}
                />

                <Controller
                  name="presentationDate"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      {...field}
                      value={
                        field.value !== undefined ? dayjs(field.value) : null
                      }
                      onChange={(newValue) => {
                        if (newValue) {
                          field.onChange(newValue.toDate())
                        } else {
                          field.value = undefined
                        }
                      }}
                      label="Fecha y hora de ejecución"
                      format={DATE_TIME_FORMAT}
                      slotProps={{
                        field: { clearable: true },
                        textField: { variant: 'outlined' },
                      }}
                      disablePast
                      disabled={checkUpdateInputPermission(
                        'presentationDate',
                        user!.role!,
                        DegreeCertificateModel.name,
                      )}
                    />
                  )}
                />

                {methods.watch('certificateTypeId') && (
                  <RHFSelect
                    id="certificateStatusId"
                    label="Estado de acta"
                    name="certificateStatusId"
                    disabled={
                      checkUpdateInputPermission(
                        'certificateStatusId',
                        user!.role!,
                        DegreeCertificateModel.name,
                      ) || !methods.watch('certificateTypeId')
                    }
                  >
                    {degCerTemplates
                      .find(
                        (type) =>
                          type.id === methods.watch('certificateTypeId') &&
                          type.certificateTypeCareers.find(
                            (certificateTypeCareer) =>
                              certificateTypeCareer.career.id ===
                              (methods.watch('student').career as ICareer)?.id,
                          ) !== undefined,
                      )
                      ?.certificateTypeStatuses.map((certificateStatus) => (
                        <MenuItem
                          key={certificateStatus.certificateStatus.id}
                          value={certificateStatus.certificateStatus.id}
                        >
                          {certificateStatus.certificateStatus.maleName}
                        </MenuItem>
                      )) ?? []}
                  </RHFSelect>
                )}
              </Stack>
            </Card>
          </Grid>
        </>
      )}
    </>
  )

  const renderUniverityChange = methods.watch('student').id! > 0 && (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Cambio de universidad
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Información relevante del cambio de universidad
          </Typography>
        </Grid>
      )}
      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="changeUniversityResolution"
              label="Resolución de cambio de universidad"
              disabled={checkUpdateInputPermission(
                'changeUniversityResolution',
                user!.role!,
                DegreeCertificateModel.name,
              )}
              inputProps={{
                maxLength: 255,
              }}
              sx={{ flexGrow: 1 }}
            />
            <RHFTextField
              name="changeUniversityName"
              label="Nombre de la universidad"
              inputProps={{
                maxLength: 255,
              }}
              disabled={checkUpdateInputPermission(
                'changeUniversityName',
                user!.role!,
                DegreeCertificateModel.name,
              )}
              sx={{ flexGrow: 1 }}
            />
            <Controller
              name="changeUniversityDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  value={field.value !== undefined ? dayjs(field.value) : null}
                  onChange={(newValue) => {
                    if (newValue) {
                      field.onChange(newValue.toDate())
                    } else {
                      field.value = undefined
                    }
                  }}
                  label="Fecha de cambio de universidad"
                  disabled={checkUpdateInputPermission(
                    'changeUniversityDate',
                    user!.role!,
                    DegreeCertificateModel.name,
                  )}
                  format={DATE_FORMAT}
                  slotProps={{
                    field: { clearable: true },
                    textField: { variant: 'outlined' },
                  }}
                  sx={{ flexGrow: 1 }}
                />
              )}
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
        {currentDegreeCertificate && (
          <Box sx={{ flexGrow: 1 }}>
            <Button
              variant="soft"
              size="large"
              sx={{ justifySelf: 'start' }}
              startIcon={<Iconify icon="eva:arrow-back-fill" />}
              onClick={() => {
                methods.reset()
                router.back()
              }}
            >
              Regresar
            </Button>
          </Box>
        )}

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
          disabled={
            methods.watch('student').id === 0 || methods.watch('topic') === ''
          }
          loading={isSubmitting}
        >
          {!currentDegreeCertificate ? 'Crear' : 'Guardar'}
        </LoadingButton>
      </Grid>
    </>
  )

  const handleStudentModalClose = async () => {
    isStudentModalOpen.onFalse()
    await refreshStudent(methods.watch('selectedValue').id)
  }

  const updateDegreeNumber = (newNumber: number) => {
    methods.setValue('number', newNumber)
    isNumerationModalOpen.onFalse()
  }

  const renderStudentModal = (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={isStudentModalOpen.value}
      onClose={handleStudentModalClose}
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
            (student) =>
              student.id === methods.watch('selectedValue' as any)?.id,
          )}
          fromModal={true}
        />
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          color="inherit"
          onClick={handleStudentModalClose}
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
          studentId={methods.watch('selectedValue' as any)?.id}
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
          studentDni={
            methods.watch('selectedValue' as any)?.label.split(' - ')[0]
          }
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

  const renderNumerationModal = (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={isNumerationModalOpen.value}
      onClose={isNumerationModalOpen.onFalse}
      sx={{
        overflow: 'hidden',
        padding: 2,
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>Numeración de acta de grado</DialogTitle>

      <DialogContent
        sx={{
          typography: 'body2',
          overflowY: 'auto',
          paddingX: 10,
          paddingY: 2,
        }}
      >
        <Stack spacing={3}>
          {enqueuedNumbers.length > 0 && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Los números son aquellos encolados y disponibles para ser
              asignados, selecciona uno para asignarlo a la acta de grado.
            </Typography>
          )}

          <Stack
            spacing={1}
            sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
          >
            {enqueuedNumbers.length > 0 ? (
              enqueuedNumbers.map((number) => (
                <Button
                  key={number}
                  variant="outlined"
                  sx={{ width: 25, height: 40 }}
                  onClick={() => updateDegreeNumber(number)}
                >
                  {number}
                </Button>
              ))
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                No hay números disponibles. Aquí se mostrarán los números
                encolados disponibles para ser asignados.
              </Typography>
            )}
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => {
            isNumerationModalOpen.onFalse()
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

      {renderNumerationModal}

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit as any)}>
        <Grid container spacing={3}>
          {renderDetails}

          {renderProperties}

          {renderUniverityChange}

          {renderActions}
        </Grid>
      </FormProvider>
    </>
  )
}
