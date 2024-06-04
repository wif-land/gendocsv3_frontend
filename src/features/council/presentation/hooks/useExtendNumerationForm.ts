import { useCouncilsStore } from '../store/councilsStore'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { CouncilsUseCasesImpl } from '../../domain/usecases/CouncilServices'

type NumerationFormValues = {
  councilId: number
  actualStart: number
  actualEnd: number
  newStart?: number | undefined
  newEnd?: number | undefined
  extendStart: boolean
  extendEnd: boolean
}

const resolveDefaultValues = () => ({
  councilId: 0,
  actualStart: 0,
  actualEnd: 0,
  newStart: undefined,
  newEnd: undefined,
  extendStart: true,
  extendEnd: true,
})

const NewDocumentSchema = yup.object({
  councilId: yup.number().required(),
  actualStart: yup.number().required(),
  actualEnd: yup.number().required(),
  newStart: yup.number(),
  newEnd: yup.number(),
  extendStart: yup.boolean().required(),
  extendEnd: yup.boolean().required(),
})

export const useExtendNumerationForm = () => {
  const router = useRouter()
  const pathname = usePathname()

  const { councils } = useCouncilsStore()

  const getAvaliableExtension = async (councilId: number) => {
    const response =
      await CouncilsUseCasesImpl.getInstance().getAvailableExtensionNumeration(
        councilId,
      )

    methods.setValue('actualStart', response.start)
    methods.setValue('actualEnd', response.end)
  }

  const methods = useForm<NumerationFormValues>({
    defaultValues: resolveDefaultValues(),
    resolver: yupResolver(NewDocumentSchema),
  })

  const onSubmit = async (data: NumerationFormValues) => {
    await CouncilsUseCasesImpl.getInstance().reserveNumeration({
      councilId: data.councilId,
      start: data.extendStart ? data.newStart : undefined,
      end: data.extendEnd ? data.newEnd : undefined,
      isExtension: true,
    })
  }

  useEffect(() => {
    if (methods.watch('councilId')) {
      getAvaliableExtension(methods.watch('councilId'))
    }
  }, [methods.watch('councilId')])

  return {
    councils,
    methods,
    router,
    pathname,
    onSubmit,
  }
}
