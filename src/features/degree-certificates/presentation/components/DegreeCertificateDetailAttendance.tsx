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
import { useState } from 'react'
import { useParams } from 'next/navigation'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import LoadingButton from '@mui/lab/LoadingButton'
import { IDegreeCertificatesAttendee } from '../../domain/entities/IDegreeCertificateAttendee'
import { DegreeCertificatesUseCasesImpl } from '../../domain/usecases/DegreeCertificatesUseCases'
import { useDegreeCertificateStore } from '../store/useDegreeCertificateStore'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { DegreeCertificateAttendeeNewEditForm } from './DegreeCertificateAttendanceNewEditForm'

export const DegreeCertificateDetailAttendance = (props: {
  members: IDegreeCertificatesAttendee[]
}) => {
  const members = props.members

  const { id: councilIdentifier } = useParams()
  const { loader } = useLoaderStore()

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Asistencia
      </Typography>
      <Card>
        <Attendance
          members={members}
          isLoading={loader.length > 0}
          degreeCertificateId={councilIdentifier as unknown as number}
        />
      </Card>
    </Box>
  )
}

const Description = (props: {
  members: IDegreeCertificatesAttendee[]
  pickedMember: IDegreeCertificatesAttendee | undefined
  handleSetAttendance: (member: IDegreeCertificatesAttendee) => void
}) => (
  <Stack spacing={3}>
    <Typography variant="body1">
      En esta sección podrás ver el detalle de los miembros del acta de grado.
    </Typography>

    <Stack spacing={3}>
      {props.members.map((member) => {
        const isLast =
          props.members.indexOf(member) === props.members.length - 1

        return (
          <Grid key={member.role} container spacing={3}>
            <Grid
              xs={12}
              md={8}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <ListItemText
                primary={
                  `${`${member.functionary?.firstName} ${member.functionary?.firstLastName}`}` ||
                  'No asignado'
                }
                secondary={member.role}
                primaryTypographyProps={{ typography: 'h6', mb: 0.5 }}
                secondaryTypographyProps={{ component: 'span' }}
              />

              <LoadingButton
                variant="contained"
                onClick={() => props.handleSetAttendance(member)}
                disabled={
                  (props.members.length === 0 || member.hasAttended) &&
                  props.pickedMember?.id !== member.id
                }
              >
                {!member.hasAttended ? 'Marcar asistencia' : 'Ha asistido '}
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
  members: IDegreeCertificatesAttendee[]
  isLoading: boolean
  degreeCertificateId: number
}) => {
  const [pickedMember, setPickedMember] = useState<
    IDegreeCertificatesAttendee | undefined
  >(undefined)

  const { getDegreeCertificate } = useDegreeCertificateStore()

  const handleSetAttendance = async (member: IDegreeCertificatesAttendee) => {
    setPickedMember(member)
    await DegreeCertificatesUseCasesImpl.getInstance().setAttendance(
      member.id as number,
    )

    await getDegreeCertificate(props.degreeCertificateId)
    setPickedMember(undefined)
  }

  const isAttendanceModalOpen = useBoolean()

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
          currentAttendee={pickedMember}
        />
      </DialogContent>
    </Dialog>
  )

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Description
        members={props.members}
        handleSetAttendance={handleSetAttendance}
        pickedMember={pickedMember}
      />
      <Button
        variant="contained"
        onClick={() => isAttendanceModalOpen.onTrue()}
      >
        Gestionar asistencia
      </Button>

      {attendanceModal}
    </Stack>
  )
}
