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
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { useDegreeCertificateForm } from '../hooks/useDegreeCertificateForm'
import { IDegreeCertificate } from '../../domain/entities/IDegreeCertificates'
import { Controller } from 'react-hook-form'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { RHFSelect } from '../../../../shared/sdk/hook-form/rhf-select'

import { useCertificateData } from '../../../../core/providers/certificate-degree-provider'
import { ICanton } from '../../../../core/providers/domain/entities/ILocationProvider'
import { useLocations } from '../../../../core/providers/locations-provider'
import { useRouter } from 'next/navigation'
import Iconify from '../../../../core/iconify'
import CustomPopover from '../../../../shared/sdk/custom-popover/custom-popover'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { usePopover } from '../../../../shared/sdk/custom-popover'
import { StudentNewEditForm } from '../../../../features/students/presentation/components/StudentNewEditForm'
import DocsByStudentListView from '../../../../features/documents/presentation/view/DocsByStudentListView'

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
  const popover = usePopover()

  const {
    methods,
    onSubmit,
    students,
    setInputValue,
    isOpen,
    loading,
    refreshStudent,
  } = useDegreeCertificateForm(currentDegreeCertificate)

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
    watch,
    getValues,
  } = methods

  const { cities, provinces } = useLocations()
  const { certificateStatuses, certificateTypes, degreeModalities, rooms } =
    useCertificateData()

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Detalles
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Hola
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
              name="number"
              label="Numeracion de acta de grado"
              disabled
              sx={{ flexGrow: 1 }}
            />
            <RHFTextField
              name="auxNumber"
              label="Numeracion"
              disabled
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
            <Stack spacing={3} sx={{ display: 'flex', flexDirection: 'row' }}>
              <RHFAutocomplete
                name="selectedValue"
                label="Estudiante"
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
                options={students?.map((student) => ({
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
            </CustomPopover>
          </Stack>
          <Stack
            spacing={3}
            sx={{ p: 3, pt: 0, display: 'flex', flexDirection: 'row' }}
          >
            <TextField
              label="Fecha de inicio de estudios"
              value={getValues('student').startStudiesDate || ''}
              disabled
              sx={{ flexGrow: 1 }}
            />
            <TextField
              name="student.endStudiesDate"
              label="Fecha de finalización de estudios"
              value={getValues('student').endStudiesDate || ''}
              // required
              sx={{ flexGrow: 1 }}
            />
          </Stack>
          <Stack
            spacing={3}
            sx={{ p: 3, pt: 0, display: 'flex', flexDirection: 'row' }}
          >
            <TextField
              label="Créditos aprobados"
              value={getValues('student').approvedCredits || ''}
              disabled
              sx={{ flexGrow: 1 }}
            />
            <TextField
              label="Horas de práctica"
              value={getValues('student').internshipHours || ''}
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
              value={getValues('student').vinculationHours || ''}
              disabled
              sx={{ flexGrow: 1 }}
            />
            <TextField
              label="Titulo de bachiller"
              value={getValues('student').bachelorDegree || ''}
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
            <FormControl sx={{ flexGrow: 1 }}>
              <InputLabel id="provincia">Provincia de residencia</InputLabel>
              <Select
                labelId="provincia"
                label="Provincia de residencia"
                value={(watch('student').canton as ICanton)?.province.id || 0}
                disabled
              >
                {provinces.map((province) => (
                  <MenuItem key={province.id} value={province.id}>
                    {province.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ flexGrow: 1 }}>
              <InputLabel id="ciudad">Ciudad de residencia</InputLabel>
              <Select
                labelId="ciudad"
                label="Ciudad de residencia"
                value={(watch('student').canton as ICanton)?.id || 0}
                disabled
              >
                {cities.map((city) => (
                  <MenuItem key={city.id} value={city.id}>
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Card>
      </Grid>
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
              sx={{ flexGrow: 1 }}
            />
            <Controller
              name="presentationDate"
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  value={dayjs(field.value)}
                  onChange={(newValue) => {
                    if (newValue) {
                      field.onChange(newValue)
                    }
                  }}
                  label="Fecha de presentación"
                  format="dddd/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                  closeOnSelect
                />
              )}
            />

            <RHFSelect
              id="certificateStatus"
              label="Estado de acta"
              name="certificateStatus"
            >
              {certificateStatuses.map((certificateStatus) => (
                <MenuItem
                  key={certificateStatus.id}
                  value={certificateStatus.id}
                >
                  {certificateStatus.maleName}
                </MenuItem>
              ))}
            </RHFSelect>

            <Stack spacing={3} sx={{ display: 'flex', flexDirection: 'row' }}>
              <RHFSelect
                id="degreeModality"
                label="Modalidad"
                name="degreeModality"
              >
                {degreeModalities.map((modality) => (
                  <MenuItem key={modality.id} value={modality.id}>
                    {modality.name}
                  </MenuItem>
                ))}
              </RHFSelect>
              {Number(methods.watch('degreeModality')) === 1 && (
                <RHFTextField name="link" label="Link" sx={{ flexGrow: 1 }} />
              )}
            </Stack>

            <RHFSelect
              id="certificateType"
              label="Tipo de grado"
              name="certificateType"
            >
              {certificateTypes.map((certificateType) => (
                <MenuItem key={certificateType.id} value={certificateType.id}>
                  {certificateType.name}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFSelect id="room" label="Aula" name="room">
              {rooms.map((room) => (
                <MenuItem key={room.id} value={room.id}>
                  {room.name}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFTextField
              name="duration"
              label="Duración"
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
        sx={{
          display: 'flex',
          justifyContent: 'end',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <RHFSwitch name="isClosed" label="Acta activa" />
        </Box>

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

  return (
    <>
      {renderStudentModal}
      {renderDocumentsModal}
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit as any)}>
        <Grid container spacing={3}>
          {renderDetails}

          {renderProperties}

          {renderActions}
        </Grid>
      </FormProvider>
    </>
  )
}
