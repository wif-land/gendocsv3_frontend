import * as yup from 'yup'
import { useProcessStore } from '../../../processes/presentation/state/useProcessStore'
import { ITemplate } from '../../domain/entities/ITemplate'
import { TemplatesUseCasesImpl } from '../../domain/usecases/TemplateServices'
import { useCallback, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { enqueueSnackbar } from 'notistack'
import { resolveEditedFields } from '../../../../shared/utils/FormUtil'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useAccountStore } from '../../../auth/presentation/state/useAccountStore'

interface FormValuesProps extends ITemplate {}

export const useTemplatesForm = (currentTemplate?: ITemplate) => {
  const router = useRouter()
  const pathname = usePathname()
  const { id } = useParams()
  const { user } = useAccountStore()
  const { processes } = useProcessStore()

  const { addTemplateToProcess, updateTemplate } = useProcessStore()

  const process = processes.find((process) => process.id === +id)

  const validationSchema = yup.object().shape({
    name: yup.string().required('El nombre es requerido'),
  })

  const defaultValues = useMemo(
    () =>
      ({
        name: currentTemplate?.name || '',
        isActive: currentTemplate?.isActive || true,
        hasStudent: currentTemplate?.hasStudent || false,
        hasFunctionary: currentTemplate?.hasFunctionary || false,
        processId: currentTemplate?.processId || process?.id,
        userId: currentTemplate?.userId || (user?.id as number),
      }) as ITemplate,
    [currentTemplate],
  )

  const methods = useForm<FormValuesProps>({
    // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'DeepPartial<FormValuesProps> | undefined'.
    resolver: yupResolver(validationSchema),
    defaultValues,
  })

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const handleCreate = useCallback(async (values: ITemplate) => {
    const result = await TemplatesUseCasesImpl.getInstance().create(values)

    addTemplateToProcess(result.template, values.processId as number)
    reset()
  }, [])

  const handleUpdate = async (
    initialValues: ITemplate,
    editedFields: Partial<ITemplate>,
  ) => {
    const { template } = await TemplatesUseCasesImpl.getInstance().update(
      initialValues.id as number,
      editedFields,
    )

    updateTemplate(
      process?.id as number,
      initialValues.id as number,
      template as ITemplate,
    )
  }

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        if (!currentTemplate?.id) {
          await handleCreate({ ...data })
        } else {
          const editedFields = resolveEditedFields<FormValuesProps>(
            defaultValues,
            data,
          )

          if (editedFields) {
            await handleUpdate(currentTemplate, editedFields)
          }
        }

        if (currentTemplate) {
          router.push(
            pathname.replace(
              new RegExp(`template/${currentTemplate.id}/edit`),
              '',
            ),
          )
        } else {
          router.push(pathname.replace(new RegExp(`template/new`), ''))
        }

        reset()
      } catch (error) {
        enqueueSnackbar('Ocurrió un error al actualizar el plantilla', {
          variant: 'error',
        })
      }
    },
    [currentTemplate, enqueueSnackbar, reset, router],
  )

  useEffect(() => {
    if (currentTemplate?.id) {
      reset()
    }
  }, [reset, currentTemplate, defaultValues])

  return { isSubmitting, methods, onSubmit, handleSubmit }
}
