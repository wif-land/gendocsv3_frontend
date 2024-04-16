import { Box, Button, CardHeader, Container, Stack } from '@mui/material'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { DefaultMemberSortableItem } from './DefaultMemberSortableItem'
import { useDefaultMembersV2 } from '../hooks/useDefaultV2'
import FormProvider from '../../../../shared/sdk/hook-form/form-provider'

const DefaultMembersView: React.FC = () => {
  const {
    handleSubmit,
    fields,
    handleAddMember,
    handleRemoveMember,
    methods,
    onSubmit,
    handleDragEnd,
  } = useDefaultMembersV2()

  return (
    <Container>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <CardHeader title="Detalles" />
        <SortableContext
          items={fields.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3} sx={{ p: 3 }}>
              <Box
                sx={{
                  columnGap: 2,
                  rowGap: 3,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {fields.map((item, index) => (
                  <DefaultMemberSortableItem
                    defaultMember={item}
                    onDelete={handleRemoveMember}
                    key={index}
                    index={index}
                  />
                ))}

                <Button onClick={handleAddMember} style={{ marginBottom: 16 }}>
                  Agregar Nuevo
                </Button>
                <Button type="submit" variant="contained">
                  Guardar
                </Button>
              </Box>
            </Stack>
          </FormProvider>
        </SortableContext>
      </DndContext>
    </Container>
  )
}

export default DefaultMembersView
