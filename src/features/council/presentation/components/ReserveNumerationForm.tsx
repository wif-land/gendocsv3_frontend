import { Card, MenuItem, Stack, Button, Grid, TextField } from '@mui/material'
import React from 'react'
import { RHFSelect } from '../../../../shared/sdk/hook-form/rhf-select'
import { RHFTextField } from '../../../../shared/sdk/hook-form'
import FormProvider from '../../../../shared/sdk/hook-form/form-provider'
import { useNumerationForm } from '../hooks/useReserveNumerationForm'
import { ICouncil } from '../../domain/entities/ICouncil'
import LoadingButton from '@mui/lab/LoadingButton'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { useResponsive } from '../../../../shared/hooks/use-responsive'

export const ReserveNumerationForm = () => {
  const { loader } = useLoaderStore()
  const { methods, onSubmit, councils, router, pathname } = useNumerationForm()
  const mdUp = useResponsive('up', 'md')

  const renderForm = (
    <Card sx={{ p: 2 }}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <RHFSelect
          name="councilId"
          label="Consejo"
          className="w-full"
          placeholder="Consejo"
        >
          {councils &&
            councils
              .filter((council) => council.isActive)
              ?.map((council: ICouncil) => (
                <MenuItem
                  key={council.id as number}
                  value={council.id as number}
                >
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
            <RHFTextField name="from" label="Desde" disabled />
            <TextField
              name="reservedQuantity"
              label="Cantidad reservada"
              value={methods.watch('to') - methods.watch('from')}
              disabled
            />
          </Stack>
          <Stack spacing={3} sx={{ width: '100%' }}>
            <RHFTextField name="to" label="Hasta" />
            <TextField
              name="nextAvaliable"
              label="Siguiente disponible"
              value={Number(methods.watch('to')) + 1}
              disabled
            />
          </Stack>
        </Stack>
      </Stack>
    </Card>
  )

  const renderActions = (
    <>
      {mdUp && <Grid md={4} item />}
      <Grid
        item
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
