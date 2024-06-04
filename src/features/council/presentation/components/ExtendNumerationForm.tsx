import { Card, MenuItem, Stack, Button, Grid } from '@mui/material'
import React from 'react'
import { RHFSelect } from '../../../../shared/sdk/hook-form/rhf-select'
import { RHFTextField } from '../../../../shared/sdk/hook-form'
import FormProvider from '../../../../shared/sdk/hook-form/form-provider'
import { useNumerationForm } from '../hooks/useNumerationForm'
import { ICouncil } from '../../domain/entities/ICouncil'
import LoadingButton from '@mui/lab/LoadingButton'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { useResponsive } from '../../../../shared/hooks/use-responsive'

export const ExtendNumerationForm = () => {
  const { loader } = useLoaderStore()
  const { methods, handleSubmit, councils } = useNumerationForm()
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
            <RHFTextField name="from" label="Actual inicial" disabled />
            <RHFTextField name="to" label="Nuevo inicial" />
          </Stack>
          <Stack spacing={3} sx={{ width: '100%' }}>
            <RHFTextField
              name="reservedQuantity"
              label="Actual final"
              disabled
            />
            <RHFTextField name="nextAvaliable" label="Nuevo final" />
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
        <Button variant="outlined" size="large">
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
      <FormProvider methods={methods} onSubmit={() => handleSubmit}>
        {renderForm}
        {renderActions}
      </FormProvider>
    </>
  )
}
