import {
  ListItemText,
  Card,
  Stack,
  Tabs,
  alpha,
  Tab,
  Box,
  Typography,
  Checkbox,
  Divider,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { ICouncilAttendee } from '../../domain/entities/ICouncilAttendee'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import LoadingButton from '@mui/lab/LoadingButton'
import { CouncilsUseCasesImpl } from '../../domain/usecases/CouncilServices'
import { useCouncilStore } from '../store/councilStore'

const TABS = [
  {
    value: 'description',
    label: 'Descripción',
  },
  {
    value: 'notifications',
    label: 'Notificaciones',
  },
  {
    value: 'attendance',
    label: 'Asistencia',
  },
]

export const CouncilDetailAttendance = (props: {
  members: ICouncilAttendee[]
}) => {
  const members = props.members
  const [membersToNotify, setMembersToNotify] = useState<ICouncilAttendee[]>([])
  const [memberToAttendance, setMembersToAttendance] = useState<
    ICouncilAttendee[]
  >([])
  const [currentTab, setCurrentTab] = useState('description')
  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue)
  }

  const { id: councilIdentifier } = useParams()
  const { loader } = useLoaderStore()

  useEffect(() => {
    if (members.length > 0) {
      setMembersToNotify(members)

      const membersToAttendance = members.filter(
        (member: ICouncilAttendee) => member.hasBeenNotified === true,
      )

      setMembersToAttendance(membersToAttendance)
    }

    return () => {
      setMembersToNotify([])
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

        {currentTab === 'notifications' && (
          <Notifications
            members={membersToNotify}
            isLoading={loader.length > 0}
            councilId={councilIdentifier as unknown as number}
          />
        )}

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

const Description = (props: { members: ICouncilAttendee[] }) => (
  <Stack spacing={3} sx={{ p: 3 }}>
    <Typography variant="body1">
      En esta sección se muestra el listado de miembros del consejo, su cargo y
      si han sido notificados o si han asistido a la reunión.
    </Typography>

    <Stack spacing={3}>
      {props.members
        .sort((a, b) => a.positionOrder - b.positionOrder)
        .map((member) => (
          <Grid key={member.positionName} container spacing={3}>
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
                secondary={member.positionName}
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

const Notifications = (props: {
  members: ICouncilAttendee[]
  isLoading: boolean
  councilId: number
}) => {
  const { getCouncil } = useCouncilStore()
  const [selectedItems, setSelectedItems] = useState<ICouncilAttendee[]>([])

  const handleNotify = async () => {
    await CouncilsUseCasesImpl.getInstance().notifyMembers({
      members: selectedItems,
      councilId: props.councilId,
    })

    await getCouncil(props.councilId)
  }

  const handleSelect = (member: ICouncilAttendee) => {
    const isSelected = selectedItems.some(
      (selected) => selected.id === member.id,
    )

    if (isSelected) {
      setSelectedItems((prev) =>
        prev.filter((selected) => selected.id !== member.id),
      )
    } else {
      setSelectedItems((prev) => [...prev, member])
    }
  }

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Stack spacing={3}>
        {props.members
          .sort((a, b) => a.positionOrder - b.positionOrder)
          .map((member) => (
            <Grid key={member.positionName} container spacing={3}>
              <Grid
                md={4}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                gap={2}
              >
                <Checkbox
                  checked={
                    selectedItems.some(
                      (selected) => selected.id === member.id,
                    ) || member.hasBeenNotified
                  }
                  disabled={member.hasBeenNotified}
                  onChange={() => handleSelect(member)}
                  color="primary"
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />

                <ListItemText
                  primary={
                    `${`${member.member?.firstName} ${member.member?.firstLastName}`}` ||
                    'No asignado'
                  }
                  secondary={member.positionName}
                  primaryTypographyProps={{ mb: 0.5 }}
                  secondaryTypographyProps={{ component: 'span' }}
                />
              </Grid>
            </Grid>
          ))}

        <LoadingButton
          variant="contained"
          loading={false}
          onClick={handleNotify}
          fullWidth
          disabled={
            props.isLoading ||
            props.members.length === 0 ||
            selectedItems.length === 0
          }
        >
          Notificar
        </LoadingButton>
      </Stack>
    </Stack>
  )
}

const Attendance = (props: {
  members: ICouncilAttendee[]
  isLoading: boolean
  councilId: number
}) => {
  const [pickedMember, setPickedMember] = useState<ICouncilAttendee | null>(
    null,
  )

  const { getCouncil } = useCouncilStore()

  const handleSetAttendance = async (member: ICouncilAttendee) => {
    setPickedMember(member)
    await CouncilsUseCasesImpl.getInstance().setAttendance(member.id as number)

    await getCouncil(props.councilId)
    setPickedMember(null)
  }

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Stack spacing={3}>
        {props.members
          .sort((a, b) => a.positionOrder - b.positionOrder)
          .map((member) => {
            const isLast =
              props.members.indexOf(member) === props.members.length - 1

            return (
              <Grid key={member.positionName} container spacing={3}>
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
                    secondary={member.positionName}
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
    </Stack>
  )
}
