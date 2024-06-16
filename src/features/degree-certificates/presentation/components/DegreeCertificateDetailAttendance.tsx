import {
  ListItemText,
  Card,
  Stack,
  Box,
  Typography,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  DEGREE_ATTENDANCE_ROLES_OPTIONS,
  IDegreeCertificatesAttendee,
} from '../../domain/entities/IDegreeCertificateAttendee'
import { DegreeCertificatesUseCasesImpl } from '../../domain/usecases/DegreeCertificatesUseCases'
import { useDegreeCertificateStore } from '../store/useDegreeCertificateStore'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { DegreeCertificateAttendeeNewEditForm } from './DegreeCertificateAttendanceNewEditForm'
import Iconify from '../../../../core/iconify'

export const DegreeCertificateDetailAttendance = () => {
  const { id: councilIdentifier } = useParams()
  const { loader } = useLoaderStore()

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Asistencia
      </Typography>
      <Card>
        <Attendance
          isLoading={loader.length > 0}
          degreeCertificateId={councilIdentifier as unknown as number}
        />
      </Card>
    </Box>
  )
}

const Description = (props: {
  members: IDegreeCertificatesAttendee[]
  degreeClosed: boolean
  handleSetAttendance: (member: IDegreeCertificatesAttendee) => void
  onEdit: (member: IDegreeCertificatesAttendee) => void
  onDelete: (memberId: number) => void
}) => (
  <Stack spacing={3}>
    <Typography variant="body1">
      En esta sección podrás ver el detalle de los miembros del acta de grado.
      Puedes añadir 4 miembros obligatorios y 2 suplentes.
    </Typography>

    <Stack spacing={3}>
      {props.members.map((member, index) => {
        const isLast = index === props.members.length - 1

        return (
          <Grid key={member.role} container spacing={3}>
            <Grid
              xs={12}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <ListItemText
                primary={
                  `${`${member.functionary?.firstName} ${member.functionary?.firstLastName}`}` ||
                  'No asignado'
                }
                secondary={
                  DEGREE_ATTENDANCE_ROLES_OPTIONS.find(
                    (role) => role.value === member.role,
                  )?.label
                }
                primaryTypographyProps={{ typography: 'h6', mb: 0.5 }}
                secondaryTypographyProps={{ component: 'span' }}
              />

              <LoadingButton
                variant="contained"
                onClick={() => props.handleSetAttendance(member)}
                disabled={
                  props.members.length === 0 ||
                  member.hasAttended ||
                  props.degreeClosed
                }
              >
                {!member.hasAttended ? 'Marcar asistencia' : 'Ha asistido '}
              </LoadingButton>

              <LoadingButton
                variant="contained"
                onClick={() => props.onEdit(member)}
                disabled={props.degreeClosed}
                sx={{
                  gap: 1,
                }}
              >
                <Iconify icon="solar:pen-bold" />
                Editar
              </LoadingButton>

              <LoadingButton
                onClick={() => props.onDelete(member.id as number)}
                disabled={props.degreeClosed}
                sx={
                  props.degreeClosed
                    ? { color: 'gray' }
                    : { color: 'error.main' }
                }
              >
                <Iconify icon="ic:baseline-delete" />
              </LoadingButton>
            </Grid>

            {!isLast && <Divider style={{ width: '100%' }} />}
          </Grid>
        )
      })}
    </Stack>
  </Stack>
)

const Attendance = (props: {
  isLoading: boolean
  degreeCertificateId: number
}) => {
  const [currentMember, setCurrentMember] =
    useState<IDegreeCertificatesAttendee>()

  const { getDegreeCertificate, degreeCertificate } =
    useDegreeCertificateStore()

  useEffect(() => {
    getDegreeCertificate(props.degreeCertificateId)
  }, [props.degreeCertificateId, getDegreeCertificate])

  const handleSetAttendance = async (member: IDegreeCertificatesAttendee) => {
    await DegreeCertificatesUseCasesImpl.getInstance().setAttendance(
      member.id as number,
    )

    await getDegreeCertificate(props.degreeCertificateId)
  }

  const isAttendanceModalOpen = useBoolean()

  const onDelete = async (memberId: number) => {
    await DegreeCertificatesUseCasesImpl.getInstance().deleteAttendee(memberId)

    await getDegreeCertificate(props.degreeCertificateId)
  }

  const attendanceModal = (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={isAttendanceModalOpen.value}
      onClose={isAttendanceModalOpen.onFalse}
      sx={{
        overflow: 'hidden',
        padding: 10,
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>Crear asistencia</DialogTitle>

      <DialogContent
        sx={{ typography: 'body2', overflowY: 'auto', paddingX: 10 }}
      >
        <DegreeCertificateAttendeeNewEditForm
          onClose={isAttendanceModalOpen.onFalse}
          degreeCertificateId={props.degreeCertificateId}
          currentAttendee={currentMember}
        />
      </DialogContent>
    </Dialog>
  )

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Description
        members={degreeCertificate.members || []}
        handleSetAttendance={handleSetAttendance}
        onEdit={(member) => {
          setCurrentMember(member)
          isAttendanceModalOpen.onTrue()
        }}
        onDelete={onDelete}
        degreeClosed={degreeCertificate.isClosed}
      />
      <Button
        variant="contained"
        disabled={
          degreeCertificate.members?.length === 6 || degreeCertificate.isClosed
        }
        onClick={() => isAttendanceModalOpen.onTrue()}
      >
        {degreeCertificate.members?.length === 6
          ? 'Ya se han añadido todos los miembros'
          : 'Añadir miembro'}
      </Button>

      {attendanceModal}
    </Stack>
  )
}
