import { useParams, usePathname, useRouter } from 'next/navigation'
import useModulesStore from '../../../../shared/store/modulesStore'
import { resolveModuleId } from '../../../../shared/utils/ModuleUtil'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { CouncilsUseCasesImpl } from '../../domain/usecases/CouncilServices'
import { useEffect, useState } from 'react'
import { ICouncil } from '../../domain/entities/ICouncil'

type NumerationFormValues = {
  councilId: number
  from: number
  to: number
}

const resolveDefaultValues = () => ({
  councilId: 1,
  from: 0,
  to: 0,
})

const NewDocumentSchema = yup.object({
  councilId: yup.number().required('El consejo es requerido'),
  from: yup
    .number()
    .typeError('Debe ser un número')
    .required('Desde es requerido'),
  to: yup
    .number()
    .typeError('Debe ser un número')
    .min(yup.ref('from'), 'Debe ser mayor ue el número de inicio')
    .required('Hasta es requerido'),
})

export const useNumerationForm = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { codeModule } = useParams()
  const [councils, setCouncils] = useState<ICouncil[]>([] as ICouncil[])

  const moduleIdentifier = resolveModuleId(
    useModulesStore().modules,
    codeModule as string,
  )

  const getNextAvailable = async (moduleId: number) => {
    const nextAvailable =
      await CouncilsUseCasesImpl.getInstance().getNextNumberAvailable(moduleId)
    methods.setValue('from', nextAvailable)
    methods.setValue('to', nextAvailable)
  }

  const getCouncils = async (moduleId: number) => {
    const councils =
      await CouncilsUseCasesImpl.getInstance().getCouncilsThatCanReserve(
        moduleId,
      )
    setCouncils(councils as ICouncil[])
  }

  const methods = useForm<NumerationFormValues>({
    defaultValues: resolveDefaultValues(),
    resolver: yupResolver(NewDocumentSchema),
  })

  const onSubmit = async (data: NumerationFormValues) => {
    await CouncilsUseCasesImpl.getInstance().reserveNumeration({
      councilId: data.councilId,
      start: data.from,
      end: data.to,
    })

    methods.reset()
    await getNextAvailable(moduleIdentifier as number)
    await getCouncils(moduleIdentifier as number)
  }

  useEffect(() => {
    if (moduleIdentifier) {
      getNextAvailable(moduleIdentifier)
    }
  }, [moduleIdentifier])

  useEffect(() => {
    if (moduleIdentifier) {
      getCouncils(moduleIdentifier)
      methods.setValue('councilId', councils[0]?.id as number)
    }
  }, [])

  return {
    councils,
    methods,
    router,
    pathname,
    onSubmit,
  }
}
