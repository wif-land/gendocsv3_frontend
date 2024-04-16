import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Button, Grid, Card, Stack, Box } from '@mui/material'
import { RHFTextField } from '../../../../shared/sdk/hook-form'
import { Controller, FieldArrayWithId } from 'react-hook-form'

export const DefaultMemberSortableItem = ({
  defaultMember,
  onDelete,
  control,
  index,
}: {
  defaultMember: FieldArrayWithId
  onDelete: (id: string) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any
  index: number
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: defaultMember.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      id={defaultMember.id}
    >
      <Grid xs={12} md={8}>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
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
              <Controller
                name={`members.${index}.member`}
                control={control}
                render={({ field }) => (
                  <RHFTextField
                    label="Miembro"
                    name={field.name}
                    value={field.value}
                    variant="outlined"
                    style={{ marginRight: 8 }}
                  />
                )}
              />

              <Controller
                name={`members.${index}.positionName`}
                control={control}
                render={({ field }) => (
                  <RHFTextField
                    label="Posición"
                    name={field.name}
                    value={field.value}
                    variant="outlined"
                    style={{ marginRight: 8 }}
                  />
                )}
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
