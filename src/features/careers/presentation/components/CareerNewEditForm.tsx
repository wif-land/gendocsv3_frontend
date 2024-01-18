import * as Yup from 'yup'
import { useCallback, useMemo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Unstable_Grid2'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel'
import { ICareer } from '../../domain/entities/ICareer'
import { useRouter } from 'next/navigation'
import { useResponsive } from '../../../../shared/hooks/use-responsive'
import { useSnackbar } from 'notistack'
import {
  RHFAutocomplete,
  RHFTextField,
} from '../../../../shared/components/hook-form'
import FormProvider from '../../../../shared/components/hook-form/form-provider'
import { useFunctionaryStore } from '../../../../shared/store/functionaryStore'

interface FormValuesProps extends Omit<ICareer, 'images'> {}

type Props = {
  currentCareer?: ICareer
}

export default function CareerNewEditForm({ currentCareer }: Props) {
  const router = useRouter()
  const { functionaries } = useFunctionaryStore()

  const mdUp = useResponsive('up', 'md')

  const { enqueueSnackbar } = useSnackbar()

  const NewCareerSchema = Yup.object().shape({
    name: Yup.string().required('Campo requerido'),
    credits: Yup.number().required('Campo requerido').max(140).min(130),
    menDegree: Yup.string().required('Campo requerido'),
    womenDegree: Yup.string().required('Campo requerido'),
    coordinator: Yup.string().required('Campo requerido'),
    internshipHours: Yup.number().required('Campo requerido').max(250).min(230),
    vinculationHours: Yup.number().required('Campo requerido').max(95).min(80),
  })

  const defaultValues = useMemo(
    () => ({
      name: '',
      credits: 0,
      menDegree: '',
      womenDegree: '',
      coordinator: '',
      internshipHours: 0,
      vinculationHours: 0,
    }),
    [currentCareer],
  )

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewCareerSchema),
    defaultValues,
  })

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const values = watch()

  console.info('VALUES', values)

  useEffect(() => {
    if (currentCareer) {
      reset(defaultValues)
    }
  }, [currentCareer, defaultValues, reset])

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
        reset()
        // enqueueSnackbar(currentCareer ? 'Update success!' : 'Create success!')
        // router.push('/careers')
        console.info('DATA', data)
      } catch (error) {
        console.error(error)
      }
    },
    [currentCareer, enqueueSnackbar, reset, router],
  )

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Detalles
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Información general de la carrera, como nombre, créditos y
            coordinador.
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="Nombre" required />

            <RHFTextField
              name="credits"
              label="Créditos"
              type="number"
              required
            />

            {functionaries && (
              <RHFAutocomplete
                name="coordinator"
                label="Coordinador"
                placeholder="Escribe el nombre del coordinador"
                freeSolo
                options={functionaries!.map(
                  (functionary: any) =>
                    `${functionary.firstName} ${functionary.firstLastName}`,
                )}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => {
                  const { dni, firstName, firstLastName } =
                    functionaries.filter(
                      (functionary) =>
                        option ===
                        `${functionary.firstName} ${functionary.firstLastName}`,
                    )[0]

                  if (!dni) {
                    return null
                  }

                  return (
                    <li {...props} key={dni}>
                      <Typography variant="body2">
                        {firstName} {firstLastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {dni}
                      </Typography>
                    </li>
                  )
                }}
                renderTags={(selected, getTagProps) =>
                  selected.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={option}
                      size="small"
                      color="info"
                      variant="soft"
                    />
                  ))
                }
              />
            )}
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
            Títulos
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Títulos que se otorgan al finalizar la carrera, masculino y
            femenino. Asimismo las horas de vinculación y prácticas.
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="menDegree" label="Título Masculino" required />

            <RHFTextField name="womenDegree" label="Título Femenino" required />

            <Divider />

            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField
                name="internshipHours"
                label="Horas de pasantías"
                type="number"
                required
              />
              <RHFTextField
                required
                name="vinculationHours"
                label="Horas de vinculación"
                type="number"
              />
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  )

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Carrera activa"
          sx={{ flexGrow: 1, pl: 3 }}
        />

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {!currentCareer ? 'Crear' : 'Guardar'}
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
