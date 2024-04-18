import { Alert, Box, Button, Card, Container, Stack } from '@mui/material'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { DefaultMemberSortableItem } from './DefaultMemberSortableItem'
import { useDefaultMembersV2 } from '../hooks/useDefaultV2'
import FormProvider from '../../../../shared/sdk/hook-form/form-provider'
import { RHFTextField } from '../../../../shared/sdk/hook-form'
import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs/custom-breadcrumbs'
import { paths } from '../../../../core/routes/paths'

const DefaultMembersView: React.FC = () => {
  const {
    handleSubmit,
    handleRemoveMember,
    methods,
    onSubmit,
    handleDragEnd,
    formattedItems,
    sendData,
    areThereChanges,
    handleDiscardChanges,
    handleEditMember,
    isEditMode,
  } = useDefaultMembersV2()

  return (
    <Container>
      <CustomBreadcrumbs
        heading="Miembros por defecto"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          { name: 'Miembros por defecto' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Card
          sx={{
            p: 3,
          }}
        >
          <Alert
            severity="info"
            variant="outlined"
            sx={{
              mb: 3,
            }}
          >
            Añade los miembros por defecto que pertenecerán al módulo. El orden
            de los miembros se puede modificar arrastrando y soltando
          </Alert>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{
                columnGap: 2,
                rowGap: 3,
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <RHFTextField
                id={`member`}
                label="Miembro"
                name={`member`}
                variant="outlined"
              />

              <RHFTextField
                id={`positionName`}
                label="Posición"
                name={`positionName`}
                variant="outlined"
              />
              {isEditMode.value ? (
                <Button
                  onClick={methods.handleSubmit(onSubmit)}
                  variant="contained"
                  sx={{ width: '50%' }}
                >
                  Editar
                </Button>
              ) : (
                <Button type="submit" variant="contained" sx={{ width: '50%' }}>
                  Agregar Nuevo
                </Button>
              )}
            </Box>
          </FormProvider>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={formattedItems.map((item) => item.member.split('-')[1])}
              strategy={verticalListSortingStrategy}
            >
              <Stack spacing={3} sx={{ py: 3 }}>
                <Box
                  sx={{
                    columnGap: 2,
                    rowGap: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    px: 3,
                  }}
                >
                  {formattedItems.map((item, index) => (
                    <DefaultMemberSortableItem
                      defaultMember={item}
                      onDelete={handleRemoveMember}
                      onEdit={handleEditMember}
                      key={index}
                      index={index}
                    />
                  ))}
                  {areThereChanges.value && (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        gap: 2,
                      }}
                    >
                      <Button
                        onClick={handleDiscardChanges}
                        variant="outlined"
                        color="error"
                        sx={{
                          flexGrow: 1,
                        }}
                      >
                        Descartar
                      </Button>
                      <Button
                        onClick={sendData}
                        variant="contained"
                        sx={{
                          flexGrow: 1,
                        }}
                      >
                        Guardar
                      </Button>
                    </Box>
                  )}
                </Box>
              </Stack>
            </SortableContext>
          </DndContext>
        </Card>
      </Stack>
    </Container>
  )
}

export default DefaultMembersView
