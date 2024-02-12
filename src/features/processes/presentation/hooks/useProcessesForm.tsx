/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from 'react-toastify'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { useProcessStore } from '../state/useProcessStore'
import { IProcess } from '../../domain/entities/IProcess'
import { ProcessesUseCasesImpl } from '../../domain/usecases/ProcessServices'
import { ProcessModel } from '../../data/models/ProcessesModel'
import { usePathname, useRouter } from 'next/navigation'
import { useFunctionaryStore } from '../../../../shared/store/functionaryStore'
import * as Yup from 'yup'
import { useCallback, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { enqueueSnackbar } from 'notistack'

interface FormValuesProps extends IProcess {}

export const useProcessForm = (currentProcess?: IProcess) => {
  const router = useRouter()
  const pathname = usePathname()
  const { functionaries, get } = useFunctionaryStore()
  const { processes, setProcesses } = useProcessStore()

  const NewProcessSchema = Yup.object().shape({
    name: Yup.string().required('Campo requerido'),
  })

  const defaultValues = useMemo(
    () =>
      ({
        name: currentProcess?.name || '',
        isActive: currentProcess?.isActive || true,
        moduleId: currentProcess?.moduleId || 0,
        userId: currentProcess?.userId || 0,
        createdAt: currentProcess?.createdAt || '',
        updatedAt: currentProcess?.updatedAt || '',
        templateProcesses: currentProcess?.templateProcesses || [],
      }) as IProcess,
    [currentProcess],
  )

  const methods = useForm<FormValuesProps>({
    // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'DeepPartial<FormValuesProps> | undefined'.
    resolver: yupResolver(NewProcessSchema),
    defaultValues,
  })

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const handleCreate = useCallback(async (values: IProcess) => {
    try {
      const result = await ProcessesUseCasesImpl.getInstance().create(values)

      if (result.process) {
        setProcesses([...processes, result.process])
        enqueueSnackbar('Proceso creado exitosamente')
        reset()
      } else {
        toast.error('Error al crear el proceso', {
          closeButton: false,
        })
      }
    } catch (error) {
      enqueueSnackbar('Ocurrió un error al crear el proceso', {
        variant: 'error',
      })
    }
  }, [])

  const handleUpdate = async (id: number, editedFields: Partial<IProcess>) => {
    try {
      const { status } = await ProcessesUseCasesImpl.getInstance().update(
        id,
        editedFields,
      )

      if (status === HTTP_STATUS_CODES.OK) {
        setProcesses(
          processes!.map((process) =>
            process.id === id
              ? new ProcessModel({
                  ...process,
                  ...editedFields,
                })
              : process,
          ),
        )
        enqueueSnackbar('Proceso actualizado exitosamente')
        reset()
      } else {
        enqueueSnackbar('Error al actualizar el proceso', {
          variant: 'error',
        })
      }
    } catch (error) {
      enqueueSnackbar('Ocurrió un error al actualizar el proceso', {
        variant: 'error',
      })
    }
  }

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        if (!currentProcess) {
          await handleCreate({
            ...data,
          })
        } else {
          const editedFields = getEditedFields<FormValuesProps>(
            defaultValues,
            data,
          )

          if (editedFields) {
            await handleUpdate(currentProcess.id as number, editedFields)
          }
        }

        router.push(
          currentProcess
            ? pathname.replace(new RegExp(`/${currentProcess.id}/edit`), '')
            : pathname.replace('/new', ''),
        )
        reset()
      } catch (error) {
        enqueueSnackbar('Error al crear la carrera', {
          variant: 'error',
        })
      }
    },
    [currentProcess, enqueueSnackbar, reset, router],
  )

  useEffect(() => {
    if (currentProcess) {
      reset(defaultValues)
    }
  }, [reset, currentProcess, defaultValues])

  useEffect(() => {
    if (!functionaries) {
      get()
    }
  }, [])

  return {
    functionaries,
    isSubmitting,
    methods,
    onSubmit,
    handleSubmit,
  }
}

type GenericObject = { [key: string]: any }

const getEditedFields = <T extends GenericObject>(
  initialValues: T,
  values: T,
): T | null => {
  const editedFields: T = {} as T

  Object.keys(initialValues).forEach((key) => {
    if (initialValues[key] !== values[key]) {
      ;(editedFields as any)[key] = values[key]
    }
  })

  if (Object.keys(editedFields).length === 0) {
    return null
  }

  return editedFields
}
