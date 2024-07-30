import { useEffect, useState } from 'react'
import {
  DEGREE_ATTENDANCE_ROLES_OPTIONS,
  IDegreeCertificatesAttendee,
} from '../../domain/entities/IDegreeCertificateAttendee'
import { useDegreeCertificateStore } from '../store/useDegreeCertificateStore'
import { DegreeCertificatesUseCasesImpl } from '../../domain/usecases/DegreeCertificatesUseCases'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { DegreeAttendeeNewEditForm } from './DegreeAttendanceNewEditForm'
import LoadingButton from '@mui/lab/LoadingButton'
import Iconify from '../../../../core/iconify'
import useLoaderStore from '../../../../shared/store/useLoaderStore'

const Description = (props: {
  members: IDegreeCertificatesAttendee[]
  degreeClosed: boolean
  handleSetAttendance: (member: IDegreeCertificatesAttendee) => void
  onEdit: (member: IDegreeCertificatesAttendee) => void
}) => {
  const loader = useLoaderStore((state) => state.loader)

  return (
    <Stack spacing={3}>
      <Typography variant="body1">
        En esta sección podrás ver el detalle de los miembros del acta de grado.
        Se debe añadir 3 miembros.
      </Typography>

      <Stack
        spacing={3}
        sx={{
          m: 3,
        }}
      >
        {!props.members || props.members.length === 0 ? (
          <Typography variant="body1">No hay miembros asignados</Typography>
        ) : (
          <>
            {props.members?.map((member, index) => {
              const isLast = index === props.members.length - 1

              return (
                <Grid
                  key={index + member.role}
                  container
                  spacing={3}
                  sx={{
                    py: 1,
                  }}
                >
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
                        props.members.length === 0 || props.degreeClosed
                      }
                      loading={loader.length > 0}
                    >
                      {!member.hasAttended
                        ? 'Marcar asistencia'
                        : 'Ha asistido '}
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
                  </Grid>

                  {!isLast && <Divider style={{ width: '100%' }} />}
                </Grid>
              )
            })}
          </>
        )}
      </Stack>
    </Stack>
  )
}

export const Attendance = (props: {
  isLoading: boolean
  degreeCertificateId: number
}) => {
  const [currentMember, setCurrentMember] =
    useState<IDegreeCertificatesAttendee>()

  const { getDegreeCertificate, degreeCertificate } =
    useDegreeCertificateStore()

  const handleSetAttendance = async (member: IDegreeCertificatesAttendee) => {
    await DegreeCertificatesUseCasesImpl.getInstance().setAttendance(
      member.id as number,
      !member.hasAttended,
    )

    await getDegreeCertificate(props.degreeCertificateId)
  }

  const isAttendanceModalOpen = useBoolean()

  const attendanceModal = (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={isAttendanceModalOpen.value}
      onClose={() => {
        isAttendanceModalOpen.onFalse()
        setCurrentMember(undefined)
      }}
      sx={{
        overflow: 'hidden',
        padding: 10,
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>Crear asistencia</DialogTitle>

      <DialogContent
        sx={{ typography: 'body2', overflowY: 'auto', paddingX: 10 }}
      >
        <DegreeAttendeeNewEditForm
          onClose={() => {
            isAttendanceModalOpen.onFalse()
            setCurrentMember(undefined)
          }}
          degreeCertificateId={props.degreeCertificateId}
          currentAttendee={currentMember}
        />
      </DialogContent>
    </Dialog>
  )

  useEffect(() => {
    getDegreeCertificate(props.degreeCertificateId)
  }, [props.degreeCertificateId])

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Description
        members={degreeCertificate.members || []}
        handleSetAttendance={handleSetAttendance}
        onEdit={(member) => {
          setCurrentMember(member)
          isAttendanceModalOpen.onTrue()
        }}
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
