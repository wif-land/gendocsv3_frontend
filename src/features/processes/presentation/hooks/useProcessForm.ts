/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'

import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { enqueueSnackbar } from 'notistack'

import { ProcessModel } from '../../data/models/ProcessesModel'
import { IProcess, IProcessFormValues } from '../../domain/entities/IProcess'

import { useProcessStore } from '../state/useProcessStore'
import useModulesStore from '../../../../shared/store/modulesStore'
import { resolveModuleId } from '../../../../shared/utils/ModuleUtil'
import { useAccountStore } from '../../../auth/presentation/state/useAccountStore'
import { resolveEditedFields } from '../../../../shared/utils/FormUtil'
import { NewProcessSchema, resolveDefaultValues } from '../constants'

export const useProcessForm = (currentProcess?: IProcess) => {
  const router = useRouter()
  const pathname = usePathname()
  const { createProcess, updateProcess } = useProcessStore()
  const { codeModule } = useParams()
  const { user } = useAccountStore()

  const moduleIdentifier = resolveModuleId(
    useModulesStore().modules,
    codeModule as string,
  )

  const defaultValues = useMemo(
    () => resolveDefaultValues(currentProcess),
    [currentProcess],
  )

  const methods = useForm<IProcessFormValues>({
    // @ts-expect-error - The resolver is correctly typed
    resolver: yupResolver(NewProcessSchema),
    defaultValues,
  })

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const onSubmit = useCallback(
    async (data: IProcessFormValues) => {
      let result
      if (!currentProcess) {
        result = await createProcess({
          ...data,
          userId: user?.id as number,
          moduleId: moduleIdentifier,
        } as ProcessModel)
      } else {
        const editedFields = resolveEditedFields<IProcessFormValues>(
          defaultValues,
          data,
        )

        if (editedFields) {
          result = await updateProcess(
            currentProcess.id as number,
            editedFields,
          )
        } else {
          enqueueSnackbar('No hay cambios por hacer', { variant: 'info' })
          return
        }
      }

      if (!result) return

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
