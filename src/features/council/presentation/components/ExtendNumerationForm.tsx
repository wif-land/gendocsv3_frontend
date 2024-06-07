import { Card, MenuItem, Stack, Button, Grid, Alert } from '@mui/material'
import React from 'react'
import { RHFSelect } from '../../../../shared/sdk/hook-form/rhf-select'
import { RHFSwitch, RHFTextField } from '../../../../shared/sdk/hook-form'
import FormProvider from '../../../../shared/sdk/hook-form/form-provider'
import { ICouncil } from '../../domain/entities/ICouncil'
import LoadingButton from '@mui/lab/LoadingButton'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { useResponsive } from '../../../../shared/hooks/use-responsive'
import { useExtendNumerationForm } from '../hooks/useExtendNumerationForm'

export const ExtendNumerationForm = () => {
  const { loader } = useLoaderStore()
  const { methods, onSubmit, councils, router, pathname } =
    useExtendNumerationForm()
  const mdUp = useResponsive('up', 'md')

  const renderForm = (
    <Card sx={{ p: 2 }}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <Alert
          severity="info"
          variant="outlined"
          sx={{
            mb: 3,
          }}
        >
          <ol>
            <li>
              Los números cargados por defecto indican el rango disponible de
              extensión
            </li>
            <li>
              Si el número a extender cargado por defecto es 0, se puede
              extender desde el número actual al 9999.
            </li>
            <li>
              Si el número a extender cargado por defecto es -1, no se puede
              extender
            </li>
          </ol>
        </Alert>
        <RHFSelect
          name="councilId"
          label="Consejo"
          className="w-full"
          placeholder="Consejo"
        >
          {councils &&
            councils.map((council: ICouncil) => (
              <MenuItem key={council.id as number} value={council.id as number}>
                {council.name}
              </MenuItem>
            ))}
        </RHFSelect>
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            gap: 3,
          }}
        >
          <Stack spacing={3} sx={{ width: '100%' }}>
            <RHFTextField
              name="actualStart"
              label="Actual inicial"
              disabled
              value={methods.watch('actualStart')}
            />

            <RHFTextField
              name="newStart"
              label="Nuevo inicial"
              disabled={!methods.watch('extendStart')}
              value={methods.watch('newStart')}
            />
            <RHFSwitch name="extendStart" label="Extender inicial" />
          </Stack>
          <Stack spacing={3} sx={{ width: '100%' }}>
            <RHFTextField
              name="actualEnd"
              label="Actual final"
              disabled
              value={methods.watch('actualEnd')}
            />
            <RHFTextField
              name="newEnd"
              label="Nuevo final"
              disabled={!methods.watch('extendEnd')}
              value={methods.watch('newEnd')}
            />
            <RHFSwitch name="extendEnd" label="Extender final" />
          </Stack>
        </Stack>
      </Stack>
    </Card>
  )

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid
        xs={12}
        mt={3}
        sx={{
          display: 'flex',
          justifyContent: 'end',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <Button
          variant="outlined"
          size="large"
          onClick={() =>
            router.push(pathname.split('/').slice(0, -1).join('/'))
          }
        >
          Cancelar
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={loader.length > 0}
        >
          Reservar
        </LoadingButton>
      </Grid>
    </>
  )

  return (
    <>
      <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
        {renderForm}
        {renderActions}
      </FormProvider>
    </>
  )
}
