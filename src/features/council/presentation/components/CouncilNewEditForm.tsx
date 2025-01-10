/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
import LoadingButton from '@mui/lab/LoadingButton'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Unstable_Grid2'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import { useResponsive } from '../../../../shared/hooks/use-responsive'
import {
  RHFAutocomplete,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
} from '../../../../shared/sdk/hook-form'
import FormProvider from '../../../../shared/sdk/hook-form/form-provider'
import { Controller } from 'react-hook-form'
import { COUNCIL_TYPES, ICouncil } from '../../domain/entities/ICouncil'
import { DateTimePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { Box, Button, Link, MenuItem } from '@mui/material'
import { useCouncilsForm } from '../hooks/useCouncilsForm'
import { useRouter } from 'next/navigation'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { DATE_TIME_FORMAT } from '../../../../core/utils/format-time'

type Props = {
  currentCouncil?: ICouncil
}

export const CouncilNewEditForm = ({ currentCouncil }: Props) => {
  const mdUp = useResponsive('up', 'md')
  const router = useRouter()
  const { loader } = useLoaderStore()
  const {
    methods,
    unusedFunctionaries,
    onSubmit,
    setSearchField,
    defaultMembers,
    pathname,
  } = useCouncilsForm(currentCouncil)

  const { handleSubmit, control } = methods

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Detalles
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            El nombre del consejo, tipo, fecha y hora de inicio. Y si está
            activo o no
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="Nombre" required />

            <RHFSelect
              name="type"
              label="Tipo"
              InputLabelProps={{ shrink: true }}
            >
              {COUNCIL_TYPES.map((council) => (
                <MenuItem key={council.value} value={council.value}>
                  {council.label}
                </MenuItem>
              ))}
            </RHFSelect>

            <Controller
              name="date"
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  {...field}
                  value={dayjs(field.value)}
                  onChange={(newValue) => {
                    if (newValue) {
                      field.onChange(newValue)
                    }
                  }}
                  label="Fecha y hora de ejecución"
                  format={DATE_TIME_FORMAT}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              )}
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
            Miembros
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Puedes elegir entre los miembros representantes por defecto o en su
            defecto elegir arbitrariamente a los miembros
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            {defaultMembers.length > 0 ? (
              Object.entries(methods.watch('members'))
                .sort(
                  ([, a], [, b]) =>
                    (a?.positionOrder as number) - (b?.positionOrder as number),
                )
                .map(([positionName, member]) => (
                  <>
                    <RHFAutocomplete
                      key={(member?.member?.id as number) + positionName}
                      name={`members[${positionName}]`}
                      label={positionName}
                      placeholder="Escribe el nombre o cédula del miembro deseado"
                      noOptionsText="No hay resultados"
                      freeSolo
                      loading={loader.length > 0}
                      getOptionLabel={(option) =>
                        (option as { label: string; id: number }).label
                      }
                      onInputChange={(_event, newInputValue) => {
                        setSearchField(newInputValue)
                      }}
                      getOptionKey={(option) => (option as { id: number }).id}
                      options={unusedFunctionaries!.map((functionary) => ({
                        id: functionary.id,
                        positionOrder: member?.positionOrder,
                        label: `${functionary.firstName} ${functionary.firstLastName} ${functionary.secondLastName} - ${functionary.dni}`,
                      }))}
                    />
                  </>
                ))
            ) : (
              <>
                <Typography variant="body2" color="text.secondary">
                  No hay miembros por defecto
                </Typography>
                <Link
                  href={`${pathname
                    .split('/')
                    .slice(0, -2)
                    .join('/')}/representantes`}
                >
                  Crear miembros por defecto
                </Link>
              </>
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
            router.back()
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
          {!currentCouncil ? 'Crear' : 'Guardar'}
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
