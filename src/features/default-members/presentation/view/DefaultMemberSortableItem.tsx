import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Button, Grid, Card, Stack, Box, Typography } from '@mui/material'
import { RHFTextField } from '../../../../shared/sdk/hook-form'
import { FieldArrayWithId } from 'react-hook-form'

export const DefaultMemberSortableItem = ({
  defaultMember,
  onDelete,
  index,
}: {
  defaultMember: FieldArrayWithId
  onDelete: (id: string) => void
  index: number
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: defaultMember.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} id={defaultMember.id}>
      <Grid xs={12} md={8}>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <div {...listeners} {...attributes} style={{ cursor: 'grab' }}>
              <Typography variant="body2">Arrastre aquí</Typography>
            </div>
            <Box
              sx={{
                columnGap: 2,
                rowGap: 3,
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  md: 'repeat(3, 2fr)',
                },
              }}
            >
              <RHFTextField
                id={`members.${index}.member`}
                label="Miembro"
                name={`members.${index}.member`}
                variant="outlined"
                style={{ marginRight: 8 }}
              />

              <RHFTextField
                id={`members.${index}.positionName`}
                label="Posición"
                name={`members.${index}.positionName`}
                variant="outlined"
                style={{ marginRight: 8 }}
              />

              <Button onClick={() => onDelete(defaultMember.id)}>
                Eliminar
              </Button>
            </Box>
          </Stack>
        </Card>
      </Grid>
    </div>
  )
}
