import { Alert, Box, Button, Card, Container, Stack } from '@mui/material'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { DefaultMemberSortableItem } from '../components/DefaultMemberSortableItem'
import { useDefaultMembersView } from '../hooks/useDefaultV2'
import FormProvider from '../../../../shared/sdk/hook-form/form-provider'
import {
  RHFAutocomplete,
  RHFCheckbox,
  RHFTextField,
} from '../../../../shared/sdk/hook-form'
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
    isOpen,
    // loading,
    setInputValue,
    members,
    // setMembers,
  } = useDefaultMembersView()

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
                alignItems: 'center',
              }}
            >
              <RHFCheckbox
                id={`isStudent`}
                name={`isStudent`}
                label="Estudiante"
              />

              <RHFAutocomplete
                sx={{ width: '100%' }}
                name="member"
                label="Miembro"
                freeSolo
                placeholder="Buscar miembro por nombre o DNI"
                open={isOpen.value}
                onOpen={isOpen.onTrue}
                onClose={() => {
                  setInputValue('')
                  isOpen.onFalse()
                  // setMembers([])
                }}
                // loading={loading}
                noOptionsText="No hay resultados"
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue)
                }}
                options={members?.map((member) => ({
                  id: member.id,
                  label: `${member.firstName} ${member.secondName} ${member.firstLastName} ${member.secondLastName} - ${member.dni}`,
                }))}
              />

              <RHFTextField
                label="Posición"
                name="positionName"
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
              items={formattedItems.map((item) => item.id)}
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
