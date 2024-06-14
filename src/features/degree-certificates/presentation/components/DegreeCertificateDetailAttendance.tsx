import {
  ListItemText,
  Card,
  Stack,
  Tabs,
  alpha,
  Tab,
  Box,
  Typography,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import LoadingButton from '@mui/lab/LoadingButton'
import { IDegreeCertificatesAttendee } from '../../domain/entities/IDegreeCertificateAttendee'
import { DegreeCertificatesUseCasesImpl } from '../../domain/usecases/DegreeCertificatesUseCases'
import { useDegreeCertificateStore } from '../store/useDegreeCertificateStore'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { DegreeCertificateAttendanceNewEditForm } from './DegreeCertificateAttendanceNewEditForm'

const TABS = [
  {
    value: 'description',
    label: 'Descripción',
  },
  {
    value: 'attendance',
    label: 'Asistencia',
  },
]

export const DegreeCertificateDetailAttendance = (props: {
  members: IDegreeCertificatesAttendee[]
}) => {
  const members = props.members
  const [memberToAttendance, setMembersToAttendance] = useState<
    IDegreeCertificatesAttendee[]
  >([])
  const [currentTab, setCurrentTab] = useState('description')
  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue)
  }

  const { id: councilIdentifier } = useParams()
  const { loader } = useLoaderStore()

  useEffect(() => {
    if (members.length > 0) {
      const membersToAttendance = members.filter(
        (member) => member.hasBeenNotified === true,
      )

      setMembersToAttendance(membersToAttendance)
    }

    return () => {
      setMembersToAttendance([])
    }
  }, [members])

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Asistencia
      </Typography>
      <Card>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            px: 3,
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {currentTab === 'description' && <Description members={members} />}

        {currentTab === 'attendance' && (
          <Attendance
            members={memberToAttendance}
            isLoading={loader.length > 0}
            councilId={councilIdentifier as unknown as number}
          />
        )}
      </Card>
    </Box>
  )
}

const Description = (props: { members: IDegreeCertificatesAttendee[] }) => (
  <Stack spacing={3} sx={{ p: 3 }}>
    <Typography variant="body1">
      En esta sección podrás ver el detalle de los miembros del acta de grado.
    </Typography>

    <Stack spacing={3}>
      {props.members.map((member, index) => (
        <Grid key={index} container spacing={3}>
          <Grid
            xs={12}
            md={4}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <ListItemText
              primary={
                `${`${member.member?.firstName} ${member.member?.firstLastName}`}` ||
                'No asignado'
              }
              secondary={member.details}
              primaryTypographyProps={{ typography: 'h6', mb: 0.5 }}
              secondaryTypographyProps={{ component: 'span' }}
            />

            <Box>
              <Typography variant="body2">
                {member.hasBeenNotified
                  ? 'Ha sido notificado'
                  : 'No ha sido notificado'}
              </Typography>

              <Typography variant="body2">
                {member.hasAttended ? 'Ha asistido' : 'No ha asistido'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      ))}
    </Stack>
  </Stack>
)

const Attendance = (props: {
  members: IDegreeCertificatesAttendee[]
  isLoading: boolean
  councilId: number
}) => {
  const [pickedMember, setPickedMember] =
    useState<IDegreeCertificatesAttendee | null>(null)

  const { getDegreeCertificate } = useDegreeCertificateStore()

  const handleSetAttendance = async (member: IDegreeCertificatesAttendee) => {
    setPickedMember(member)
    await DegreeCertificatesUseCasesImpl.getInstance().setAttendance(
      member.id as number,
    )

    await getDegreeCertificate(props.councilId)
    setPickedMember(null)
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
      <DialogTitle sx={{ pb: 2 }}>Gestionar asistencia</DialogTitle>

      <DialogContent
        sx={{ typography: 'body2', overflowY: 'auto', paddingX: 10 }}
      >
        <DegreeCertificateAttendanceNewEditForm
          onClose={isAttendanceModalOpen.onFalse}
        />
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => {
            isAttendanceModalOpen.onFalse()
          }}
        >
          Regresar
        </Button>
      </DialogActions>
    </Dialog>
  )

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Button
        variant="contained"
        onClick={() => isAttendanceModalOpen.onTrue()}
      >
        Gestionar asistencia
      </Button>

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
                    `${`${member.member?.firstName} ${member.member?.firstLastName}`}` ||
                    'No asignado'
                  }
                  secondary={member.role}
                  primaryTypographyProps={{ typography: 'h6', mb: 0.5 }}
                  secondaryTypographyProps={{ component: 'span' }}
                />

                <LoadingButton
                  variant="contained"
                  loading={props.isLoading && pickedMember?.id === member.id}
                  onClick={() => handleSetAttendance(member)}
                  disabled={
                    (props.isLoading ||
                      props.members.length === 0 ||
                      member.hasAttended) &&
                    pickedMember?.id !== member.id
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

      {attendanceModal}
    </Stack>
  )
}
