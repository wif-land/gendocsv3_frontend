import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Unstable_Grid2'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

import { useResponsive } from '../../../../shared/hooks/use-responsive'
import { RHFAutocomplete, RHFTextField } from '../../../../shared/sdk/hook-form'
import FormProvider from '../../../../shared/sdk/hook-form/form-provider'

import { IPosition } from '../../domain/entities/IPosition'
import { useFunctionaryForm } from '../hooks/usePositionForm'
import { Button } from '@mui/material'
import { useRouter } from 'next/navigation'

type Props = {
  currentPosition?: IPosition
}

export const PositionNewEditForm = ({ currentPosition }: Props) => {
  const mdUp = useResponsive('up', 'md')
  const router = useRouter()

  const { methods, onSubmit, functionaries, setInputValue, isOpen, loading } =
    useFunctionaryForm(currentPosition)

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4} gap={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Detalles
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Variable:
            <br />
            <Typography variant="caption" color="text.primary">
              Identificador único (sin espacios) para documentos automatizados.
              <br />
              Ej: COOR_SOFTWARE
            </Typography>
          </Typography>
          <br />

          <Typography variant="body2" color="text.secondary">
            Nombre del cargo:
            <br />
            <Typography variant="caption" color="text.primary">
              Título oficial en la empresa.
              <br />
              Ej: Coordinador de Ingeniería en Software
            </Typography>
          </Typography>
          <br />

          <Typography variant="body2" color="text.secondary">
            Funcionario:
            <br />
            <Typography variant="caption" color="text.primary">
              Nombre de la persona en el cargo.
              <br />
              Ej: Juan Pérez - 123456789
            </Typography>
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="variable"
              label="Variable"
              required
              placeholder="Ej: COOR_SOFTWARE "
            />
            <RHFTextField
              name="name"
              label="Nombre del cargo"
              required
              placeholder="Ej: Coordinador de Ingeniería en Software"
            />

            <RHFAutocomplete
              name="functionary"
              label="Funcionario"
              open={isOpen.value}
              onOpen={isOpen.onTrue}
              onClose={() => {
                setInputValue('')
                isOpen.onFalse()
              }}
              loading={loading}
              noOptionsText="No hay resultados"
              options={functionaries?.map(
                (functionary) =>
                  `${functionary.firstName} ${functionary.secondName} ${functionary.firstLastName} ${functionary.secondLastName} - ${functionary.dni}`,
              )}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue)
              }}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => {
                const {
                  dni,
                  firstName,
                  firstLastName,
                  secondName,
                  secondLastName,
                } = functionaries.filter(
                  (functionary) =>
                    option ===
                    `${functionary.firstName} ${functionary.secondName} ${functionary.firstLastName} ${functionary.secondLastName} - ${functionary.dni}`,
                )[0]

                if (!dni) {
                  return null
                }

                return (
                  <li {...props} key={dni}>
                    <Typography variant="body2">
                      {firstName} {secondName} {firstLastName} {secondLastName}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {dni}
                    </Typography>
                  </li>
                )
              }}
            />
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
        sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}
      >
        <Box sx={{ flexGrow: 1 }}></Box>

        <Button
          variant="outlined"
          size="large"
          onClick={() => {
            methods.reset()
            router.back()
          }}
        >
          Cancelar
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {!currentPosition ? 'Crear' : 'Guardar'}
        </LoadingButton>
      </Grid>
    </>
  )

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderActions}
      </Grid>
    </FormProvider>
  )
}
