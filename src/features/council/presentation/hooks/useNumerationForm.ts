import { useParams, usePathname, useRouter } from 'next/navigation'
import { useCouncilsStore } from '../store/councilsStore'
import useModulesStore from '../../../../shared/store/modulesStore'
import { resolveModuleId } from '../../../../shared/utils/ModuleUtil'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

type NumerationFormValues = {
  councilId: number
  from: number
  to: number
  reservedQuantity: number
  nextAvaliable: number
}

const resolveDefaultValues = () => ({
  councilId: 1,
  from: 0,
  to: 0,
  reservedQuantity: 0,
  nextAvaliable: 0,
})

const NewDocumentSchema = yup.object({
  councilId: yup.number().required('El consejo es requerido'),
  from: yup.number().required('Desde es requerido'),
  to: yup.number().required('Hasta es requerido'),
  reservedQuantity: yup.number().required('Cantidad reservada es requerida'),
  nextAvaliable: yup.number().required('Siguiente disponible es requerido'),
})

export const useNumerationForm = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { codeModule } = useParams()

  const { councils } = useCouncilsStore()
  const moduleIdentifier = resolveModuleId(
    useModulesStore().modules,
    codeModule as string,
  )

  const methods = useForm<NumerationFormValues>({
    defaultValues: resolveDefaultValues(),
    resolver: yupResolver(NewDocumentSchema),
  })

  const handleSubmit = (data: any) => {
    console.log(data)
  }

  return {
    councils,
    methods,
    router,
    handleSubmit,
  }
}
