import { Alert, Box, Button, Card, Chip, Container, Stack } from '@mui/material'
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
    formattedItems,
    sendData,
    areThereChanges,
    handleDiscardChanges,
    handleEditMember,
    isEditMode,
    isOpen,
    loading,
    setInputValue,
    members,
    setMembers,
  } = useDefaultMembersView()

  const showMessage = (index: number) => {
    switch (index) {
      case 0:
        return 'Presidente'
      case 1:
        return 'Presidente subrogante'
      default:
        return 'Miembro'
    }
  }

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

          {formattedItems.length < 2 && (
            <Alert
              severity="error"
              variant="outlined"
              sx={{
                mb: 3,
              }}
            >
              Es necesario ingresar un presidente y un presidente subrogante
            </Alert>
          )}

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
                label={`Agregar ${showMessage(formattedItems.length)}`}
                freeSolo
                placeholder="Buscar miembro por nombre o DNI"
                open={isOpen.value}
                onOpen={isOpen.onTrue}
                onClose={() => {
                  setInputValue('')
                  isOpen.onFalse()
                  setMembers([])
                }}
                loading={loading}
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
                  {`Agregar ${showMessage(formattedItems.length)}`}
                </Button>
              )}
            </Box>
          </FormProvider>

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
                <>
                  <Chip label={showMessage(index)} variant="outlined" />
                  <DefaultMemberSortableItem
                    defaultMember={item}
                    onDelete={handleRemoveMember}
                    onEdit={handleEditMember}
                    key={index}
                    index={index}
                  />
                </>
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
                    color="secondary"
                    sx={{
                      flexGrow: 1,
                    }}
                  >
                    Descartar
                  </Button>
                  <Button
                    onClick={sendData}
                    variant="contained"
                    color="primary"
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
        </Card>
      </Stack>
    </Container>
  )
}

export default DefaultMembersView
