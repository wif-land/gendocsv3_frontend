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
import { useFunctionaryForm } from '../hooks/useFunctionaryForm'
import { useEffect, useState } from 'react'
import { FunctionaryUseCasesImpl } from '../../../../features/functionaries/domain/usecases/FunctionaryServices'
import { useDebounce } from '../../../../shared/hooks/use-debounce'
import { useFunctionaryStore } from '../../../../features/functionaries/presentation/state/useFunctionaryStore'

type Props = {
  currentPosition?: IPosition
}

export const PositionNewEditForm = ({ currentPosition }: Props) => {
  const mdUp = useResponsive('up', 'md')
  const { methods, onSubmit } = useFunctionaryForm(currentPosition)

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const { functionaries, setFunctionaries } = useFunctionaryStore()

  const [inputValue, setInputValue] = useState('' as string)
  const debouncedValue = useDebounce(inputValue)

  useEffect(() => {
    if (inputValue) {
      const filteredFunctionaries = async (field: string) => {
        await FunctionaryUseCasesImpl.getInstance()
          // eslint-disable-next-line no-magic-numbers
          .getByField(field, 5, 0)
          .then((res) => {
            // eslint-disable-next-line no-magic-numbers
            if (res.status === 200) {
              setFunctionaries(res.data.functionaries)
              return
              // eslint-disable-next-line no-magic-numbers
            } else if (res.status !== 404) {
              setFunctionaries([])
              return
            }
          })
      }
      filteredFunctionaries(debouncedValue)
    } else {
      setFunctionaries([])
    }
  }, [debouncedValue])

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Variable
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Es el término que será usado para referirse al funcionario en los
            documentos.
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Detalles" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="variable"
              label="Variable"
              required
              placeholder="Ej: {{COOR_SOFTWARE}} "
            />
          </Stack>
        </Card>
      </Grid>
    </>
  )

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Nombre
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Es el nombre asignado a la variable, este será útil para realizar
            busquedas más adelante
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="name"
              label="Nombre del cargo"
              required
              placeholder="Ej: Coordinador de Ingeniería en Software"
            />

            <RHFAutocomplete
              name="functionary"
              label="Funcionario"
              options={functionaries.map(
                (option) =>
                  `${option.firstName} ${option.secondName} ${option.firstLastName} ${option.secondLastName} - ${option.dni}`,
              )}
              onInputChange={(event, newInputValue) => {
                newInputValue !== '' && setInputValue(newInputValue)
              }}
              onChange={(event, newValue) => {
                console.log((newValue as string)?.split(' - ')[1])
                const functionary = functionaries.find((functionary) => {
                  functionary?.dni === (newValue as string)?.split(' - ')[1]
                })
                console.log(functionary)
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
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}></Box>

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

        {renderProperties}

        {renderActions}
      </Grid>
    </FormProvider>
  )
}
