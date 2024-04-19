import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Button, Card, Stack, Box } from '@mui/material'
import { IDefaultMembers } from '../../domain/entities/DefaultMembers'
import { Icon } from '@iconify/react/dist/iconify.js'

interface MemberFormat extends IDefaultMembers {
  isStudent: boolean
}

export const DefaultMemberSortableItem = ({
  defaultMember,
  onDelete,
  onEdit,
}: {
  defaultMember: MemberFormat
  onDelete: (id: string) => void
  onEdit: (id: string) => void
  index: number
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: (defaultMember.member as string).split('-')[1] })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      id={(defaultMember.member as string).split('-')[1]}
    >
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
            {...listeners}
            {...attributes}
            style={{ cursor: 'grab' }}
            ref={setNodeRef}
            id={(defaultMember.member as string).split('-')[1]}
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Icon
              icon="mdi:drag-vertical-variant"
              width="1.2rem"
              height="1.2rem"
            />
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
              {`${(defaultMember.member as string).split('-')[0]} `}
            </Box>
            <Box
              component="div"
              sx={{ typography: 'subtitle2', color: 'text.disabled' }}
            >
              {`  - ${(defaultMember.member as string).split('-')[1]}`}
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
              onClick={() =>
                onEdit((defaultMember.member as string).split('-')[1])
              }
            >
              Editar
            </Button>
            <Button
              onClick={() =>
                onDelete((defaultMember.member as string).split('-')[1])
              }
              variant="outlined"
              color="error"
              sx={{ px: 5 }}
            >
              Eliminar
            </Button>
          </Box>
        </Stack>
      </Card>
    </div>
  )
}
