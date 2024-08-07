import { Button, Card, Stack, Box } from '@mui/material'
import { Icon } from '@iconify/react/dist/iconify.js'

interface MemberFormat {
  id: number
  member: {
    id: string
    label: string
  }
  positionName: string
  isStudent: boolean
}

export const DefaultMemberSortableItem = ({
  defaultMember,
  onDelete,
  onEdit,
}: {
  defaultMember: MemberFormat
  onDelete: (id: number) => void
  onEdit: (id: number) => void
  index: number
}) => (
  <Card variant="outlined">
    <Stack
      sx={{
        display: 'grid',
        gridTemplateColumns: '8% repeat(2, 1fr) 15%',
        gap: 2,
        alignItems: 'center',
        p: 2,
      }}
    >
      <Box
        style={{ cursor: 'grab' }}
        id={defaultMember.member.id}
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {defaultMember.isStudent === true ? (
          <Icon icon="ph:student-thin" width="48" height="48" />
        ) : (
          <Icon icon="icons8:briefcase" width="48" height="48" />
        )}
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box component="div" color="inherit">
          {defaultMember.member.label}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          ml: 2,
          gap: 1,
        }}
      >
        <Box component="div" color="inherit">
          Posición asignada:
        </Box>
        <Box
          component="div"
          sx={{ typography: 'subtitle2', color: 'text.disabled' }}
        >
          {` ${defaultMember.positionName}`}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 2,
          mr: 2,
        }}
      >
        <Button
          variant="outlined"
          color="info"
          onClick={() => onEdit(defaultMember.id)}
        >
          Editar
        </Button>
        <Button
          onClick={() => onDelete(defaultMember.id)}
          variant="outlined"
          color="error"
          sx={{ px: 5 }}
        >
          Eliminar
        </Button>
      </Box>
    </Stack>
  </Card>
)
