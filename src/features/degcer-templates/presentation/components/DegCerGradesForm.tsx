import { Box, Button, Stack } from '@mui/material'

import DegCerGradesListView from '../views/DegCerGradesListView'
import { useDegCerGradesForm } from '../hooks/useDegCerForm'
import FormProvider from '../../../../shared/sdk/hook-form/form-provider'
import { RHFTextField } from '../../../../shared/sdk/hook-form'

export const DegCerGradesForm = ({
  certificateStatusId,
}: {
  certificateStatusId: number
}) => {
  const { methods, onSubmit } = useDegCerGradesForm()

  return (
    <Stack>
      <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
        <Box
          sx={{
            columnGap: 2,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            p: 3,
          }}
        >
          <RHFTextField
            sx={{ flex: 1 }}
            name="gradeVariable"
            label={`Nombre de la variable`}
          />

          <RHFTextField
            label="Celda"
            name="cell"
            variant="outlined"
            sx={{ flex: 1 }}
          />

          <Button variant="contained" sx={{ flex: 1 }} type="submit">
            Agregar
          </Button>
        </Box>
      </FormProvider>

      <DegCerGradesListView certificateStatusId={certificateStatusId} />
    </Stack>
  )
}
