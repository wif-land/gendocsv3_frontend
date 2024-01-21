import LoadingButton from '@mui/lab/LoadingButton'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Unstable_Grid2'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import { useResponsive } from '../../../../shared/hooks/use-responsive'
import {
  RHFAutocomplete,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
} from '../../../../shared/components/hook-form'
import FormProvider from '../../../../shared/components/hook-form/form-provider'
import { useCouncilStore } from '../store/councilsStore'
import { useSnackbar } from 'notistack'
import * as Yup from 'yup'
import { useCallback, useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  COUNCIL_TYPES,
  CouncilType,
  ICouncil,
} from '../../domain/entities/ICouncil'
import { CouncilsUseCasesImpl } from '../../domain/usecases/CouncilServices'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { CouncilModel } from '../../data/models/CouncilModel'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { MobileDateTimePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { Box, Chip } from '@mui/material'
import { useFunctionaryStore } from '../../../../shared/store/functionaryStore'

interface FormValuesProps extends ICouncil {}

type Props = {
  currentCouncil?: ICouncil
}

export default function CouncilNewEditForm({ currentCouncil }: Props) {
  const { enqueueSnackbar } = useSnackbar()
  const router = useRouter()
  const { codeModule, subModuleName } = useParams()
  const pathname = usePathname()
  const { functionaries } = useFunctionaryStore()
  const mdUp = useResponsive('up', 'md')

  const NewCouncilSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es requerido'),
    date: Yup.date().required('La fecha es requerida'),
    type: Yup.string().required('El tipo es requerido'),
    moduleId: Yup.number().required('El módulo es requerido'),
    userId: Yup.number().required('El usuario es requerido'),
    isActive: Yup.boolean().required('El estado es requerido'),
    isArchived: Yup.boolean().required('El estado es requerido'),
    president: Yup.string().required('El presidente es requerido'),
    subrogant: Yup.string().required('El subrogante es requerido')
  })

  const defaultValues = useMemo(
    () => ({
      name: currentCouncil?.name || '',
      date: currentCouncil?.date || new Date(Date.now() + 200),
      type: currentCouncil?.type || CouncilType.ORDINARY,
      moduleId: currentCouncil?.moduleId || 0,
      userId: currentCouncil?.userId || 0,
      isActive: currentCouncil?.isActive || false,
      isArchived: currentCouncil?.isArchived || false,
    }),
    [currentCouncil],
  )

  const methods = useForm<ICouncil>({
    resolver: yupResolver(NewCouncilSchema),
    defaultValues,
  })

  const {
    reset,
    watch,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods

  const values = watch()

  console.info('VALUES', values)
  const { addCouncil, councils, setCouncils } = useCouncilStore()

  useEffect(() => {
    if (currentCouncil) {
      reset(defaultValues)
    }
  }, [currentCouncil, reset])

  const handleCreateCouncil = useCallback(async (values: ICouncil) => {
    const result = await CouncilsUseCasesImpl.getInstance().create(values)

    if (result.council) {
      addCouncil(result.council)
      enqueueSnackbar('Consejo creado exitosamente')
    } else {
      enqueueSnackbar('Error al crear el consejo')
    }
  }, [])

  const handleUpdateCouncil = async (
    id: number,
    editedFields: Partial<ICouncil>,
  ) => {
    const { status } = await CouncilsUseCasesImpl.getInstance().update(
      id,
      editedFields,
    )

    if (status === HTTP_STATUS_CODES.OK) {
      setCouncils(
        councils!.map((council) =>
          council.id === id
            ? new CouncilModel({
                ...council,
                ...editedFields,
              })
            : council,
        ),
      )
      enqueueSnackbar('Consejo actualizado exitosamente')
    } else {
      enqueueSnackbar('Error al actualizar el consejo')
    }
  }

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
        console.info('DATA', data)

        if (!currentCouncil) {
          await handleCreateCouncil(data)
        } else {
          await handleUpdateCouncil(currentCouncil.id as number, data)
        }

        router.push(
          currentCouncil
            ? pathname.replace(new RegExp(`/${currentCouncil.id}/edit`), '')
            : pathname.replace('/new', ''),
        )
        reset()
      } catch (error) {
        console.error(error)
        enqueueSnackbar(
          !currentCouncil
            ? 'Error al crear el consejo'
            : 'Error al actualizar el consejo',
        )
      }
    },
    [currentCouncil, enqueueSnackbar, reset, router],
  )

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
            <RHFTextField name="name" label="Nombre" />

            <RHFSelect
              native
              name="type"
              label="Tipo"
              InputLabelProps={{ shrink: true }}
            >
              {COUNCIL_TYPES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </RHFSelect>

            <Controller
              name="date"
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <MobileDateTimePicker
                  {...field}
                  value={dayjs(field.value)}
                  onChange={(newValue) => {
                    if (newValue) {
                      field.onChange(newValue)
                    }
                  }}
                  label="Fecha de ejecución"
                  format="dddd/MM/YYYY hh:mm a"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                  disablePast
                />
              )}
            />

            <RHFSwitch name="isActive" label="Consejo Activo" />
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
            Se elijen a los miembros del consejo
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            {functionaries && (
              <RHFAutocomplete
                name="president"
                label="Presidente"
                placeholder="Escribe el nombre del presidente"
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

            {functionaries && (
              <RHFAutocomplete
                name="subrogant"
                label="Subrogante"
                placeholder="Escribe el nombre del subrogante"
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

            <Divider sx={{ borderStyle: 'dashed' }} />

            {functionaries && (
              <RHFAutocomplete
                name="subrogant"
                label="Miembro 1"
                placeholder="Escribe el nombre del miembro 1"
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

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', justifyContent: 'end' }}>
        <LoadingButton type="submit" variant="contained" size="large">
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
