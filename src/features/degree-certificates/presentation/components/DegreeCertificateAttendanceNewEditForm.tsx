import { Box, Button, Card, CardHeader, Grid, Stack } from '@mui/material'
import FormProvider from '../../../../shared/sdk/hook-form/form-provider'
import LoadingButton from '@mui/lab/LoadingButton'
import { RHFAutocomplete, RHFSwitch } from '../../../../shared/sdk/hook-form'
import { useResponsive } from '../../../../shared/hooks/use-responsive'
import { useDegreeCertificateAttendanceForm } from '../hooks/useDegreeCertificateAttendanceForm'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { RoleLabels } from '../constants'

interface Props {
  onClose: VoidFunction
}
export const DegreeCertificateAttendanceNewEditForm = (props: Props) => {
  const loader = useLoaderStore((state) => state.loader)
  const { handleSubmit, onSubmit, methods } =
    useDegreeCertificateAttendanceForm()

  const mdUp = useResponsive('up', 'md')

  const renderProperties = (
    <>
      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            {Object.entries(methods.watch('members')).map(
              ([positionName, member]) => (
                <>
                  <RHFAutocomplete
                    key={(member?.member?.id as number) + positionName}
                    name={`members[${positionName}]`}
                    label={RoleLabels[positionName as keyof typeof RoleLabels]}
                    placeholder="Escribe el nombre o cédula del miembro deseado"
                    noOptionsText="No hay resultados"
                    freeSolo
                    loading={loader.length > 0}
                    getOptionLabel={(option) =>
                      (option as { label: string; id: number }).label
                    }
                    // onInputChange={(_event, newInputValue) => {
                    //   setSearchField(newInputValue)
                    // }}
                    getOptionKey={(option) => (option as { id: number }).id}
                    options={[].map((functionary) => ({
                      id: functionary.id,
                      label: `${functionary.firstName} ${functionary.firstLastName} ${functionary.secondLastName} - ${functionary.dni}`,
                    }))}
                  />
                </>
              ),
            )}
          </Stack>
        </Card>
      </Grid>
    </>
  )

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid
        xs={12}
        md={8}
        sx={{
          display: 'flex',
          justifyContent: 'end',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <RHFSwitch name="isActive" label="Consejo activo" />
        </Box>

        <Button
          variant="outlined"
          size="large"
          onClick={() => {
            methods.reset()
            props.onClose()
          }}
        >
          Cancelar
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={loader.length > 0}
        >
          Crear
        </LoadingButton>
      </Grid>
    </>
  )

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ p: 3 }}>
        {renderProperties}
        {renderActions}
      </Stack>
    </FormProvider>
  )
}
