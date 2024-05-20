/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'

import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { enqueueSnackbar } from 'notistack'

import { ProcessModel } from '../../data/models/ProcessesModel'
import { IProcess } from '../../domain/entities/IProcess'
import { ProcessesUseCasesImpl } from '../../domain/usecases/ProcessServices'

import { useProcessStore } from '../state/useProcessStore'
import useModulesStore from '../../../../shared/store/modulesStore'
import { resolveModuleId } from '../../../../shared/utils/ModuleUtil'
import { useAccountStore } from '../../../auth/presentation/state/useAccountStore'

interface FormValuesProps extends IProcess {}

export const useProcessForm = (currentProcess?: IProcess) => {
  const router = useRouter()
  const pathname = usePathname()
  const { processes, setProcesses } = useProcessStore()
  const { codeModule } = useParams()
  const { user } = useAccountStore()

  const moduleIdentifier = resolveModuleId(
    useModulesStore().modules,
    codeModule as string,
  )

  const NewProcessSchema = Yup.object().shape({
    name: Yup.string().required('Campo requerido'),
  })

  const defaultValues = useMemo(
    () =>
      ({
        name: currentProcess?.name || '',
        isActive: currentProcess?.isActive || true,
        moduleId: currentProcess?.moduleId || moduleIdentifier,
        userId: currentProcess?.userId || (user?.id as number),
        createdAt: currentProcess?.createdAt || undefined,
        updatedAt: currentProcess?.updatedAt || undefined,
        templateProcesses: undefined,
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

  const handleCreate = useCallback(
    async (values: IProcess) =>
      await ProcessesUseCasesImpl.getInstance().create(values),
    [],
  )

  const handleUpdate = async (
    id: number,
    editedFields: Partial<IProcess>,
  ): Promise<ProcessModel> => {
    const result = await ProcessesUseCasesImpl.getInstance().update(
      id,
      editedFields,
    )

    if (result.id !== 0) {
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
    }

    return result
  }

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      let result
      if (!currentProcess) {
        result = await handleCreate({
          ...data,
        })
      } else {
        const editedFields = getEditedFields<FormValuesProps>(
          defaultValues,
          data,
        )

        if (editedFields) {
          result = await handleUpdate(currentProcess.id as number, editedFields)
        }
      }

      if (result?.id !== 0) return

      if (currentProcess) {
        router.push(
          pathname.replace(new RegExp(`/${currentProcess.id}/edit`), ''),
        )
      } else {
        router.push(pathname.replace('/new', ''))
      }

      reset()
    },
    [currentProcess, enqueueSnackbar, reset, router],
  )

  useEffect(() => {
    if (currentProcess) {
      reset(defaultValues)
    }
  }, [reset, currentProcess, defaultValues])

  return {
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
