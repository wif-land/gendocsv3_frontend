import { ListItemText, Card, Stack, Checkbox } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import LoadingButton from '@mui/lab/LoadingButton'
import { ICouncilAttendee } from '../../domain/entities/ICouncilAttendee'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { useState } from 'react'
import { CouncilsUseCasesImpl } from '../../domain/usecases/CouncilServices'
import { useParams } from 'next/navigation'
import { resolveModuleId } from '../../../../shared/utils/ModuleUtil'
import useModulesStore from '../../../../shared/store/modulesStore'

export const CouncilDetailAttendance = (props: {
  members: ICouncilAttendee[]
}) => {
  const { codeModule } = useParams()

  const moduleIdentifier = resolveModuleId(
    useModulesStore().modules,
    codeModule as string,
  )

  const alreadyNotified = useBoolean(
    props.members.some((member) => member.hasBeenNotified),
  )
  const [membersToNotify, setMembersToNotify] = useState<number[]>([])
  const isSubmitting = useBoolean(false)

  const handleCheckOrUncheck = (member: ICouncilAttendee) => {
    setMembersToNotify((prev) => {
      if (!membersToNotify.includes(member.id!)) {
        return [...prev, member.id]
      }

      return prev.filter((id) => id !== member.id) || []
    })
  }

  const handleNotify = async () => {
    isSubmitting.onTrue()
    CouncilsUseCasesImpl.getInstance()
      .notifyMembers({
        members: membersToNotify,
        id: moduleIdentifier,
      })
      .then(() => {
        isSubmitting.onFalse()
      })
      .catch(() => {
        isSubmitting.onFalse()
      })
  }

  return (
    <Stack component={Card} spacing={3} sx={{ p: 3 }}>
      {props.members.map((member) => (
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
                `${`${member.functionary?.firstName} ${member.functionary?.firstLastName}`}` ||
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
