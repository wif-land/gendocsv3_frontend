import { ListItemText, Card, Stack, Checkbox } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import LoadingButton from '@mui/lab/LoadingButton'
import { ICouncilAttendee } from '../../domain/entities/ICouncilAttendee'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { useState } from 'react'
import { CouncilsUseCasesImpl } from '../../domain/usecases/CouncilServices'
import { useParams } from 'next/navigation'
import { CouncilAttendanceServices } from '../../domain/usecases/CouncilAttendanceServices'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { useCouncilStore } from '../store/councilStore'

export const CouncilDetailAttendance = () => {
  const { id: councilIdentifier } = useParams()
  const loader = useLoaderStore()
  const { council, setCouncil } = useCouncilStore()

  const alreadyNotified = useBoolean(
    council.members.some((member) => member.hasBeenNotified),
  )
  const [membersToNotify, setMembersToNotify] = useState<number[]>([])
  const isSubmitting = useBoolean(false)

  const handleCheckOrUncheck = (member: ICouncilAttendee) => {
    const alreadyInList = membersToNotify?.includes(member.id!)

    if (alreadyInList) {
      setMembersToNotify((prev) => prev?.filter((id) => id !== member.id))
      return
    }

    setMembersToNotify((prev) => [...(prev || []), member.id!])
  }

  const handleNotify = async () => {
    isSubmitting.onTrue()
    CouncilsUseCasesImpl.getInstance()
      .notifyMembers({
        members: membersToNotify,
        id: Number(councilIdentifier),
      })
      .then(() => {
        isSubmitting.onFalse()
        CouncilsUseCasesImpl.getInstance()
          .getById(Number(councilIdentifier))
          .then((data) => {
            setCouncil(data)
          })
      })
      .catch(() => {
        isSubmitting.onFalse()
      })
  }

  const handleAttend = async (member: ICouncilAttendee) => {
    isSubmitting.onTrue()
    CouncilAttendanceServices.getInstance()
      .handleCouncilAttendance(member?.id as number)
      .then(() => {
        CouncilsUseCasesImpl.getInstance()
          .getById(Number(councilIdentifier))
          .then((data) => {
            setCouncil(data)
          })
      })
  }

  return (
    <Stack component={Card} spacing={3} sx={{ p: 3 }}>
      {council.members.map((member) => (
        <Grid key={member.positionName} container spacing={3}>
          {!alreadyNotified.value && (
            <Checkbox
              checked={membersToNotify.includes(member.id!)}
              onChange={() => handleCheckOrUncheck(member)}
            />
          )}
          <Grid xs={12} md={4}>
            <ListItemText
              primary={
                `${`${member.member?.firstName} ${member.member?.firstLastName}`}` ||
                'No asignado'
              }
              secondary={member.positionName}
              primaryTypographyProps={{ typography: 'h6', mb: 0.5 }}
              secondaryTypographyProps={{ component: 'span' }}
            />
          </Grid>

          {alreadyNotified.value && (
            <Grid xs={12} md={8}>
              <Stack spacing={1} alignItems={'end'}>
                <LoadingButton
                  type="button"
                  onClick={() => handleAttend(member)}
                  loading={loader.loader.length > 0}
                  variant="contained"
                  disabled={member.hasAttended}
                >
                  {member.hasAttended ? 'Asistió' : 'Marcar asistencia'}
                </LoadingButton>
              </Stack>
            </Grid>
          )}
        </Grid>
      ))}

      {!alreadyNotified.value && (
        <LoadingButton
          variant="contained"
          loading={isSubmitting.value}
          disabled={membersToNotify.length === 0}
          onClick={handleNotify}
        >
          Notificar
        </LoadingButton>
      )}
    </Stack>
  )
}
